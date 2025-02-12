const DISCOVERY_DOCS = ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta'];
const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';
const CLIENT_ID = '1097344377477-00qph6q9jiin2muv6ntpsg9go98lqbfe.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBdJdlS7a_e3oidJYrT9PfnAxPYtXri0UM'
const PROPERTY_ID = '474019939';

let tokenClient;

function handleAuthClick() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        fetchAnalyticsData();
      } else {
        console.error("Autentifikacija nije uspjela.");
      }
    },
  });

  // Zatraži pristupni token od korisnika
  tokenClient.requestAccessToken();
}

// Funkcija za odjavu
function handleSignoutClick() {
  google.accounts.oauth2.revoke(localStorage.getItem("access_token"), () => {
    document.getElementById('chartContainer').style.display = 'none';
    document.getElementById('signoutButton').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('value').style.display = 'none';
    console.log("User signed out.");
  });
  localStorage.removeItem("access_token");
}


async function fetchAnalyticsData(dateRangeValue = "today") {
  
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Nema pristupnog tokena. Prijavite se ponovno.");
    return;
  }

  document.getElementById('signoutButton').style.display = 'block';
  document.getElementById('header').style.display = 'block';
  document.getElementById('controls').style.display = 'block';

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`;

  const requestBodies = {
    country: {
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: dateRangeValue, endDate: "today" }],
    },
    city: {
      dimensions: [{ name: 'city' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: dateRangeValue, endDate: "today" }],
    },
    browser: {
      dimensions: [{ name: 'browser' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: dateRangeValue, endDate: "today" }],
    },
    deviceCategory: {
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: dateRangeValue, endDate: "today" }],
    },
    topPages: {
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dateRanges: [{ startDate: dateRangeValue, endDate: "today" }],
    }
  };

  const requestBody_session = {
    metrics: [{ name: 'averageSessionDuration' }],
    dateRanges: [{ startDate: dateRangeValue, endDate: 'today' }],
  };

  const requestBodies_topPages = {
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dateRanges: [{ startDate: dateRangeValue, endDate: "today" }],
  };

  try {
    const responses = await Promise.all(
      Object.entries(requestBodies).map(async ([key, body]) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(`${key} API Error: ${errorDetails.error.message}`);
        }
        return { key, data: await response.json() };
      })
    );

    const chartData = Object.fromEntries(responses.map(({ key, data }) => [key, data]));
    renderCharts(chartData);


    const responses_session = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody_session),
      });
  
    if (!responses_session.ok) {
      const errorDetails = await responses_session.json();
      throw new Error(`API Error: ${errorDetails.error.message}`);
    }

    renderCharts_session(responses_session);

  } catch (err) {
    console.error("Greška u dohvaćanju podataka:", err);
  }
}

async function renderCharts_session(response) {
    const chartContainer = document.getElementById("chartContainer");
    chartContainer.style.display = "flex";

    const chartWrapper = document.createElement("div");
    chartWrapper.classList.add("chart-wrapper");

    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = `chart_session`;
    chartWrapper.appendChild(chartCanvas);
    chartContainer.appendChild(chartWrapper);

  try {
    // Parsiraj JSON odgovor s podacima
    const data = await response.json();

    // Priprema podataka za graf
    const chartData = {
      labels: ['Session Duration'],
      datasets: [
        {
          label: 'Prosječno trajanje sesije (seconds)',
          data: [parseFloat(data.rows[0].metricValues[0].value)],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };

    new Chart(chartCanvas.getContext('2d'), {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
      },
    });

  } catch (error) {
    console.error('Greška u renderiranju grafa:', error);
  }
}

function renderCharts(chartData) {
  const chartContainer = document.getElementById("chartContainer");
  chartContainer.style.display = "flex";
  chartContainer.innerHTML = '';

  const types = ['bar', 'bar', 'doughnut', 'pie', 'bar'];

  Object.entries(chartData).forEach(([key, data], index) => {
    if (!data || !data.rows || data.rows.length === 0) {
      console.warn(`Nema podataka za ${key}`);
      return;
    }

    const labels = data.rows.map(row => row.dimensionValues[0].value);
    const values = data.rows.map(row => parseInt(row.metricValues[0].value, 10));

    const chartWrapper = document.createElement("div");
    chartWrapper.classList.add("chart-wrapper");

    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = `chart_${key}`;
    chartWrapper.appendChild(chartCanvas);
    chartContainer.appendChild(chartWrapper);

    const type = types[index % types.length];

    new Chart(chartCanvas.getContext('2d'), {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          label: `Broj aktivnih korisnika ${key}`,
          data: values,
          backgroundColor: labels.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`),
          borderColor: labels.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
          legend: { 
            position: 'top',
            display: type !== 'bar'
          },
          title: { 
            display: true, 
            text: key === 'topPages' ? 'Najposjećenije stranice' : `Broj aktivnih korisnika po ${key}` 
          },
        },
        layout: {
          padding: 10
        }
      },
    });
  });
}


document.getElementById("controls").addEventListener("submit", (event) => {
  event.preventDefault();
  const dateRangeValue = document.getElementById("date-range").value;
  const valueDiv = document.getElementById('value');

  if(dateRangeValue == "today"){
    valueDiv.textContent = `Izabrani raspon: Danas`;
  }
  else if(dateRangeValue == "7daysAgo"){
    valueDiv.textContent = `Izabrani raspon: Posljednjih 7 dana`;
  }
  else if(dateRangeValue == "30daysAgo"){
    valueDiv.textContent = `Izabrani raspon: Posljednih mjesec dana`;
  }
  else if(dateRangeValue == "90daysAgo"){
    valueDiv.textContent = `Izabrani raspon: Posljednja 3 mjeseca`;
  }
  fetchAnalyticsData(dateRangeValue);
});