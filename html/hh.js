// const CLIENT_ID = '1097344377477-00qph6q9jiin2muv6ntpsg9go98lqbfe.apps.googleusercontent.com';
//         const API_KEY = 'AIzaSyBdJdlS7a_e3oidJYrT9PfnAxPYtXri0UM';
const DISCOVERY_DOCS = ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta'];
const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';
const CLIENT_ID = '1097344377477-00qph6q9jiin2muv6ntpsg9go98lqbfe.apps.googleusercontent.com';  // Zamijeni s tvojim Client ID-om
const API_KEY = 'AIzaSyBdJdlS7a_e3oidJYrT9PfnAxPYtXri0UM';  // Zamijeni s tvojim API Key-om
const PROPERTY_ID = '443269906';  // Zamijeni s tvojim Property ID-om
let isAuthenticated = false;

// Funkcija za autentifikaciju
function handleAuthClick() {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
  });
  google.accounts.id.prompt(); 
}

// Funkcija za odgovor nakon autentifikacije
function handleCredentialResponse(response) {
  console.log("Authentication Response: ", response);
  const token = response.credential;
  localStorage.setItem("access_token", token); 
  isAuthenticated = true;
  document.getElementById('chart').style.display = 'block';
  fetchAnalyticsData();
}

// Funkcija za odjavu
function handleSignoutClick() {
  google.accounts.oauth2.revoke(localStorage.getItem("access_token"), () => {
    isAuthenticated = false;
    document.getElementById('chart').style.display = 'none';
    console.log("User signed out.");
  });
  localStorage.removeItem("access_token");
}

// Funkcija za dohvaćanje podataka iz Google Analytics Data API v1
async function fetchAnalyticsData() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Nema pristupnog tokena. Prijavite se ponovno.");
    return;
  }

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`;
  const requestBody = {
    dimensions: [{ name: 'date' }, { name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error(`Greška u API pozivu: ${response.status} - ${errorDetails.error.message}`);
      return;
    }

    const data = await response.json();
    renderChart(data);
  } catch (err) {
    console.error("Greška u dohvaćanju podataka:", err);
  }
}

// Funkcija za renderiranje grafikona
function renderChart(data) {
  if (!data || !data.rows) {
    console.error("Nema podataka za prikaz.");
    return;
  }

  const labels = data.rows.map(row => row[0]);
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Active Users',
      data: data.rows.map(row => row[1]),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Google Analytics Data' },
      },
    },
  });
}

// Inicijalizacija nakon učitavanja stranice
window.onload = function() {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
  });
};
