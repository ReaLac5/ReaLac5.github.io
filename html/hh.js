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
// Funkcija za dohvaćanje podataka iz Google Analytics Data API v1
async function fetchAnalyticsData() {
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
  const requestBody = {
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'activeUsers' }],
    dateRanges: [{ startDate: "7daysAgo", endDate: today }],
  };

  try {
    // Pošalji POST zahtjev na API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Priloži pristupni token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // Pretvori tijelo zahtjeva u JSON format
    });

    // Provjera statusa odgovora
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error(`Greška u API pozivu: ${response.status} - ${errorDetails.error.message}`);
      return;
    }

    // Obradi uspješan odgovor
    const data = await response.json();
    console.log("API Response:", data);
    renderChart(data); // Pošalji podatke funkciji za renderiranje grafikona
  } catch (err) {
    console.error("Greška u dohvaćanju podataka:", err);
  }
}

// Funkcija za renderiranje grafikona
function renderChart(data) {
  if (!data || !data.rows || data.rows.length === 0) {
    alert("No data available for the selected date range.");
    console.error("No data available for display.");
    return;
  }

  const labels = data.rows.map(row => row.dimensionValues[0].value);
  const activeUsers = data.rows.map(row => parseInt(row.metricValues[0].value, 10));

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Active Users',
      data: activeUsers,
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
