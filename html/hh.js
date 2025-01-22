// const CLIENT_ID = '1097344377477-00qph6q9jiin2muv6ntpsg9go98lqbfe.apps.googleusercontent.com';
//         const API_KEY = 'AIzaSyBdJdlS7a_e3oidJYrT9PfnAxPYtXri0UM';
const DISCOVERY_DOCS = ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta'];
const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';
const CLIENT_ID = '1097344377477-00qph6q9jiin2muv6ntpsg9go98lqbfe.apps.googleusercontent.com';  // Zamijeni s tvojim Client ID-om
const API_KEY = 'AIzaSyBdJdlS7a_e3oidJYrT9PfnAxPYtXri0UM';  // Zamijeni s tvojim API Key-om
const PROPERTY_ID = '474019939';  // Zamijeni s tvojim Property ID-om
let isAuthenticated = false;

let tokenClient;

function handleAuthClick() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        fetchAnalyticsData(); // Pozovi dohvaćanje podataka nakon uspješne prijave
      } else {
        console.error("Autentifikacija nije uspjela.");
      }
    },
  });

  // Zatraži pristupni token od korisnika
  tokenClient.requestAccessToken();
}

// Funkcija za odgovor nakon autentifikacije
function handleCredentialResponse(response) {
  console.log("Authentication Response: ", response);
  const token = response.credential;
  localStorage.setItem("access_token", token); 
  isAuthenticated = true;
  document.getElementById('chart').style.display = 'block';
  document.getElementById('signoutButton').style.display = 'block';
  fetchAnalyticsData();
}

// Funkcija za odjavu
function handleSignoutClick() {
  google.accounts.oauth2.revoke(localStorage.getItem("access_token"), () => {
    isAuthenticated = false;
    document.getElementById('chart').style.display = 'none';
    document.getElementById('signoutButton').style.display = 'none'; 
    console.log("User signed out.");
  });
  localStorage.removeItem("access_token");
}


function getDateRange(value) {
  const today = new Date();
  const startDate = new Date();

  switch (value) {
    case "today":
      return { startDate: today.toISOString().split("T")[0], endDate: today.toISOString().split("T")[0] };
    case "7daysAgo":
      startDate.setDate(today.getDate() - 7);
      return { startDate: startDate.toISOString().split("T")[0], endDate: today.toISOString().split("T")[0] };
    case "lastMonth":
      startDate.setMonth(today.getMonth() - 1);
      startDate.setDate(1);
      const endOfLastMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      return { startDate: startDate.toISOString().split("T")[0], endDate: endOfLastMonth.toISOString().split("T")[0] };
    case "3monthsAgo":
      startDate.setMonth(today.getMonth() - 3);
      return { startDate: startDate.toISOString().split("T")[0], endDate: today.toISOString().split("T")[0] };
    default:
      return { startDate: "7daysAgo", endDate: "today" };
  }
}

// Funkcija za dohvaćanje podataka iz Google Analytics Data API v1
// Funkcija za dohvaćanje podataka iz Google Analytics Data API v1
/*async function fetchAnalyticsData() {
  // Dohvati pristupni token iz lokalne pohrane
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Nema pristupnog tokena. Prijavite se ponovno.");
    return;
  }

  // URL za Google Analytics Data API zahtjev
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`;
  const today = new Date().toISOString().split('T')[0];
  // Tijelo zahtjeva s dimenzijama, metrima i vremenskim rasponom
  const activeUsersRequestBody = {
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'activeUsers' }],
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
  };

  const sessionsRequestBody = {
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }],
    dateRanges: [{ startDate: "7daysAgo", endDate: today }],
  };

  try {
    // Pošalji POST zahtjev za aktivne korisnike
    const activeUsersResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activeUsersRequestBody),
    });

    // Provjera statusa odgovora
    if (!activeUsersResponse.ok) {
      const errorDetails = await activeUsersResponse.json();
      console.error(`Greška u API pozivu: ${activeUsersResponse.status} - ${errorDetails.error.message}`);
      return;
    }

    // Obradi uspješan odgovor za aktivne korisnike
    const activeUsersData = await activeUsersResponse.json();
    
    // Pošalji POST zahtjev za broj sesija
    const sessionsResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionsRequestBody),
    });

    if (!sessionsResponse.ok) {
      const errorDetails = await sessionsResponse.json();
      console.error(`Greška u API pozivu: ${sessionsResponse.status} - ${errorDetails.error.message}`);
      return;
    }

    // Obradi uspješan odgovor za sesije
    const sessionsData = await sessionsResponse.json();
    console.log("API Response for Active Users:", activeUsersData);
    console.log("API Response for Sessions:", sessionsData);

    // Pozovi funkciju za renderiranje oba grafikona
    renderCharts(activeUsersData, sessionsData);
    
  } catch (err) {
    console.error("Greška u dohvaćanju podataka:", err);
  }
}*/

async function fetchAnalyticsData(dateRange) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Nema pristupnog tokena. Prijavite se ponovno.");
    return;
  }

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`;

  const requestBodies = {
    country: {
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    },
    browser: {
      dimensions: [{ name: 'browser' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    },
    city: {
      dimensions: [{ name: 'city' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    },
    deviceCategory: {
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    },
    deviceModel: {
      dimensions: [{ name: 'deviceModel' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    },
    operatingSystem: {
      dimensions: [{ name: 'operatingSystem' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    },
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

  } catch (err) {
    console.error("Greška u dohvaćanju podataka:", err);
  }
}

// Funkcija za renderiranje grafikona
/*function renderCharts(activeUsersData, sessionsData) {
  if (!activeUsersData || !activeUsersData.rows || activeUsersData.rows.length === 0 || !sessionsData || !sessionsData.rows || sessionsData.rows.length === 0) {
    alert("No data available for the selected date range.");
    console.error("No data available for display.");
    return;
  }

  const labels = activeUsersData.rows.map(row => row.dimensionValues[0].value);

  const activeUsers = activeUsersData.rows.map(row => parseInt(row.metricValues[0].value, 10));
  const sessions = sessionsData.rows.map(row => parseInt(row.metricValues[0].value, 10));

  const activeUsersChartData = {
    labels: labels,
    datasets: [{
      label: 'Active Users',
      data: activeUsers,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const sessionsChartData = {
    labels: labels,
    datasets: [{
      label: 'Sessions',
      data: sessions,
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }],
  };

  const chartContainer = document.getElementById("chartContainer");
  chartContainer.style.display = "flex";

  // Prikazivanje prvog grafikona (aktivni korisnici)
  const ctx1 = document.getElementById('chart_jj').getContext('2d');
  new Chart(ctx1, {
    type: 'bar',
    data: activeUsersChartData,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Active Users Over Last 7 Days' },
      },
    },
  });

  // Prikazivanje drugog grafikona (sesije)
  const ctx2 = document.getElementById('chart_kk').getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    data: sessionsChartData,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Sessions Over Last 7 Days' },
      },
    },
  });
}*/





function renderCharts(chartData) {
  const chartContainer = document.getElementById("chartContainer");
  chartContainer.style.display = "flex";
  chartContainer.innerHTML = '';

  Object.entries(chartData).forEach(([key, data]) => {
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
    chartWrapper.appendChild(chartCanvas); // Dodaj canvas u novi div
    chartContainer.appendChild(chartWrapper);

    new Chart(chartCanvas.getContext('2d'), {
      type: 'doughnut', // Koristimo 'doughnut' za zanimljiviji prikaz
      data: {
        labels: labels,
        datasets: [{
          label: `Active Users by ${key}`,
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
          legend: { position: 'top' },
          title: { display: true, text: `Active Users by ${key}` },
        },
      },
    });
  });
}





function updateDateRangeState() {
  const dateRangeElement = document.getElementById("dateRange");

  // Dodaj događaj za promjenu vremenskog raspona
  dateRangeElement.addEventListener("change", (event) => {
    const selectedRange = event.target.value;
    const dateRange = getDateRange(selectedRange);
    fetchAnalyticsData(dateRange); // Dohvati podatke za novi vremenski raspon
  });

  // Početno dohvaćanje podataka za zadani raspon (npr. Last 7 Days)
  const defaultRange = "7daysAgo";
  const dateRange = getDateRange(defaultRange);
  fetchAnalyticsData(dateRange);
}


dateRangeElement.addEventListener("change", (event) => {
  const selectedRange = event.target.value;
  const dateRange = getDateRange(selectedRange);
  fetchAnalyticsData(dateRange); // Dohvati podatke za novi vremenski raspon
});


// Inicijalizacija nakon učitavanja stranice
window.onload = function() {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
  });

  updateDateRangeState();
};
