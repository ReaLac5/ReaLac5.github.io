// const CLIENT_ID = '1097344377477-00qph6q9jiin2muv6ntpsg9go98lqbfe.apps.googleusercontent.com';
//         const API_KEY = 'AIzaSyBdJdlS7a_e3oidJYrT9PfnAxPYtXri0UM';
//         const DISCOVERY_DOCS = ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta'];
//         const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';

//         let isAuthenticated = false;

//         // Inicijalizacija Google API-ja
//         function initClient() {
//             gapi.load('client:auth2', async () => {
//                 await gapi.client.init({
//                     apiKey: API_KEY,
//                     clientId: CLIENT_ID,
//                     discoveryDocs: DISCOVERY_DOCS,
//                     scope: SCOPES
//                 });

//                 gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
//                 updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//             });
//         }

//         // Provjera statusa prijave
//         function updateSigninStatus(isSignedIn) {
//             if (isSignedIn) {
//                 isAuthenticated = true;
//                 document.getElementById('chart').style.display = 'block';
//                 fetchAnalyticsData();
//             } else {
//                 isAuthenticated = false;
//                 document.getElementById('chart').style.display = 'none';
//             }
//         }

//         // Funkcija za prijavu
//         function handleAuthClick() {
//             gapi.auth2.getAuthInstance().signIn().then(user => {
//                 const token = user.getAuthResponse().access_token;
//                 localStorage.setItem("access_token", token);
//                 isAuthenticated = true;
//                 document.getElementById('chart').style.display = 'block';
//                 fetchAnalyticsData();
//             }).catch(error => {
//                 console.error("Prijava nije uspjela:", error);
//             });
//         }

//         // Funkcija za odjavu
//         function handleSignoutClick() {
//             gapi.auth2.getAuthInstance().signOut().then(() => {
//                 localStorage.removeItem("access_token");
//                 isAuthenticated = false;
//                 document.getElementById('chart').style.display = 'none';
//                 console.log("Korisnik je odjavljen.");
//             });
//         }

//         // Dohvaćanje podataka iz Google Analytics API-ja
//         async function fetchAnalyticsData() {
//             const token = localStorage.getItem("access_token");
//             if (!token) {
//                 console.error("Nema pristupnog tokena. Prijavite se ponovno.");
//                 return;
//             }

//             const propertyId = '474019939';  // Unesi ispravan Property ID
//             const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

//             const requestBody = {
//                 dimensions: [{ name: 'date' }, { name: 'country' }],
//                 metrics: [{ name: 'activeUsers' }],
//                 dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }]
//             };

//             try {
//                 const response = await fetch(url, {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(requestBody),
//                 });

//                 if (!response.ok) {
//                     const errorDetails = await response.json();
//                     console.error(`Greška u API pozivu: ${response.status} - ${errorDetails.error.message}`);
//                     return;
//                 }

//                 const data = await response.json();
//                 renderChart(data);
//             } catch (err) {
//                 console.error("Greška u dohvaćanju podataka:", err);
//             }
//         }

//         // Prikazivanje grafikona s podacima
//         function renderChart(data) {
//             if (!data || !data.rows) {
//                 console.error("Nema podataka za prikaz.");
//                 return;
//             }

//             const labels = data.rows.map(row => row.dimensionValues[0].value); 
//             const values = data.rows.map(row => parseInt(row.metricValues[0].value, 10));

//             const chartData = {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Active Users',
//                     data: values,
//                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1,
//                 }],
//             };

//             const ctx = document.getElementById('chart').getContext('2d');
//             new Chart(ctx, {
//                 type: 'bar',
//                 data: chartData,
//                 options: {
//                     responsive: true,
//                     plugins: {
//                         legend: { position: 'top' },
//                         title: { display: true, text: 'Google Analytics Data' },
//                     },
//                 },
//             });
//         }

//         window.onload = initClient;