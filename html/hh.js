const CLIENT_ID = '1097344377477-00qph6q9jiin2muv6ntpsg9go98lqbfe.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBdJdlS7a_e3oidJYrT9PfnAxPYtXri0UM';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/analytics/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';
const REDIRECT_URI = 'https://your-site-url.com/redirect-page';

let isAuthenticated = false;
let tokenClient;

// Funkcija koja se poziva kad je korisnik autentificiran
function handleCredentialResponse(response) {
  console.log(response);
  const credential = response.credential;
  if (credential) {
    const token = credential; 
    localStorage.setItem("access_token", token); 
    isAuthenticated = true;
    document.getElementById('chart').style.display = 'block';
    fetchAnalyticsData();
  } else {
    console.error("Nema tokena.");
  }
}

// Funkcija za pokretanje autentifikacije
function handleAuthClick() {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
  });

  google.accounts.id.prompt(); 
}

// Funkcija za odjavu korisnika
function handleSignoutClick() {
  google.accounts.oauth2.revoke(localStorage.getItem("access_token"), () => {
    isAuthenticated = false;
    document.getElementById('chart').style.display = 'none';
    console.log("User signed out.");
  });
  localStorage.removeItem("access_token");
}

// Dohvaćanje podataka iz Google Analytics API-a
async function fetchAnalyticsData() {
  const token = localStorage.getItem("access_token");
  console.log(token)
  if (!token) {
    console.error("Nema pristupnog tokena. Prijavite se ponovno.");
    return;
  }

  const propertyId = '474019939';  // Zamijeni s tvojim Google Analytics Property ID
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const requestBody = {
    dimensions: [{ name: 'date' }],
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

// Inicijalizirajte Google Identity Services
window.onload = function() {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
  });
  document.querySelector('button[onclick="handleAuthClick()"]').disabled = false; 
};
