/*const CLIENT_ID = '214036241518-be5frrk0bus3h05oo3dt6b2t1j19onr3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAJugTkVuqv5BbYEPm9rr7U4mPSA5fvdmI';
const DISCOVERY_DOCS =
    ["https://analyticsdata.googleapis.com/$discovery/rest?version=v1"];
const SCOPES = "https://www.googleapis.com/auth/analytics.readonly";
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        console.log("Google API spreman!");
    });
}
gapi.load("client:auth2", initClient);*/

/*const CLIENT_ID = '214036241518-be5frrk0bus3h05oo3dt6b2t1j19onr3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAJugTkVuqv5BbYEPm9rr7U4mPSA5fvdmI';
const DISCOVERY_DOCS = ["https://analyticsdata.googleapis.com/$discovery/rest?version=v1"];
const SCOPES = "https://www.googleapis.com/auth/analytics.readonly";
const REDIRECT_URI = 'https://eportfoliomatijasic.netlify.app/html/chart.html';

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
        redirectUri: REDIRECT_URI
    }).then(() => {
        console.log("Google API spreman!");
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('authorize_button').style.display = 'none';
        document.getElementById('signout_button').style.display = 'inline';
    } else {
        document.getElementById('authorize_button').style.display = 'inline';
        document.getElementById('signout_button').style.display = 'none';
    }
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        console.log('Prijava uspješna');
        updateSigninStatus(true);
        fetchAnalyticsData(); // Dohvati podatke odmah nakon prijave
    },
    (error) => {console.error('Greška u prijavi: ', error);}
);
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut().then(() => {
        updateSigninStatus(false);
    });
}

function loadGoogleAPI() {
    gapi.load('client:auth2', initClient); // 'client' i 'auth2' su moduli koji će se učitati
}*/

/*const CLIENT_ID = '214036241518-be5frrk0bus3h05oo3dt6b2t1j19onr3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAJugTkVuqv5BbYEPm9rr7U4mPSA5fvdmI';
const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';

let tokenClient;
let accessToken = null;

document.getElementById('authorize_button').addEventListener('click', () => handleAuthClick());
document.getElementById('signout_button').addEventListener('click', () => handleSignoutClick());

function initClient() {
  gapi.load('client', () => {
    gapi.client.setApiKey(API_KEY);
    gapi.client.load('https://analyticsdata.googleapis.com/$discovery/rest?version=v1')
      .then(() => console.log('Google API initialized'))
      .catch(err => console.error('Error loading API:', err));
  });

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.error) {
        console.error('Authorization failed', response);
        return;
      }
      accessToken = response.access_token;
      updateSigninStatus(true);
    },
  });
}

function handleAuthClick() {
  if (!accessToken) {
    tokenClient.requestAccessToken();
  }
}

function handleSignoutClick() {
  google.accounts.oauth2.revoke(accessToken, () => {
    console.log('Token revoked.');
    accessToken = null;
    updateSigninStatus(false);
  });
}

function updateSigninStatus(isSignedIn) {
  document.getElementById('authorize_button').style.display = isSignedIn ? 'none' : 'inline';
  document.getElementById('signout_button').style.display = isSignedIn ? 'inline' : 'none';
}*/

/*const CLIENT_ID = '214036241518-be5frrk0bus3h05oo3dt6b2t1j19onr3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAJugTkVuqv5BbYEPm9rr7U4mPSA5fvdmI';
const DISCOVERY_DOCS =
    ["https://analyticsdata.googleapis.com/$discovery/rest?version=v1"];
const SCOPES = "https://www.googleapis.com/auth/analytics.readonly";
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        console.log("Google API spreman!");
    });
}
gapi.load("client:auth2", initClient);*/

// Postavke za autentifikaciju
const CLIENT_ID = '214036241518-be5frrk0bus3h05oo3dt6b2t1j19onr3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAJugTkVuqv5BbYEPm9rr7U4mPSA5fvdmI';
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/analytics/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';
const REDIRECT_URI = 'https://eportfoliomatijasic.netlify.app/html/chart.html';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let isAuthenticated = false;

// Inicijalizacija GAPI klijenta
/*function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
    redirectUri: 'https://eportfoliomatijasic.netlify.app/html/chart.html'
  });
  gapiInited = true;
  maybeEnableButtons();
}

// Inicijalizacija Google Identity Services
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: 'https://eportfoliomatijasic.netlify.app/html/chart.html',
    callback: (tokenResponse) => {
        console.log("Odgovor od Googlea:", tokenResponse);
        if (tokenResponse.access_token) {
            localStorage.setItem("access_token", tokenResponse.access_token);
            isAuthenticated = true;
            const chartElement = document.getElementById('chart');
            if (chartElement) {
                chartElement.style.display = 'block';
            }
            fetchAnalyticsData();
        } else {
            console.error('Nema pristupnog tokena!');
        }
    },
  });
  if (tokenClient) {
    console.log("TokenClient je inicijaliziran.");
  }
  gisInited = true;
  maybeEnableButtons();
}*/

function gapiLoaded() {
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
      redirectUri: REDIRECT_URI
    }).then(() => {
      gapiInited = true;
      maybeEnableButtons();
      // Inicijaliziraj GIS nakon što je GAPI klijent inicijaliziran
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        callback: handleTokenResponse
      });
      gisInited = true;
      maybeEnableButtons();
    }).catch((err) => {
      console.error("Greška u inicijalizaciji GAPI klijenta:", err);
    });
  });
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.querySelector('button[onclick="handleAuthClick()"]').disabled = false;
  }
}

function handleTokenResponse(tokenResponse) {
  console.log("Odgovor od Googlea:", tokenResponse);
  if (tokenResponse.access_token) {
    localStorage.setItem("access_token", tokenResponse.access_token);
    isAuthenticated = true;
    const chartElement = document.getElementById('chart');
    if (chartElement) {
      chartElement.style.display = 'block';
    }
    fetchAnalyticsData();
  } else {
    console.error('Nema pristupnog tokena!');
  }
}

function handleAuthClick() {
  if (tokenClient) {
    console.log("Prijava započela...");
    tokenClient.requestAccessToken(); // Pokreće autentifikaciju korisnika
  }
}

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token, () => {
      console.log('User signed out.');
      isAuthenticated = false;
      document.getElementById('chart').style.display = 'none';
    });
    gapi.client.setToken(null);
  }
}

function transformAnalyticsData(result) {
  const labels = result.rows.map(row => row.dimensionValues.map(dv => dv.value).join(' - '));
  const data = result.rows.map(row => row.metricValues[0].value);

  return {
    labels,
    datasets: [{
      label: 'Active Users',
      data,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };
}

async function fetchAnalyticsData() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Nema pristupnog tokena. Prijavite se ponovno.");
    return;
  }

  try {
    gapi.client.setToken({ access_token: token });
    const response = await gapi.client.analyticsdata.properties.runReport({
      property: "properties/443269906",
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "country" }, { name: "deviceCategory" }, { name: "pagePath" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "averageSessionDuration" }]
      }
    });
    console.log(response.result);
    const data = transformAnalyticsData(response.result);
    renderChart(data);
  } catch (err) {
    console.error("Greška u dohvaćanju analitike:", err);
  }
}

function renderChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar', // Tip grafikona
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Google Analytics Data'
        }
      }
    }
  });
}