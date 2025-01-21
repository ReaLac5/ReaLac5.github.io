const CLIENT_ID = '214036241518-be5frrk0bus3h05oo3dt6b2t1j19onr3.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyAJugTkVuqv5BbYEPm9rr7U4mPSA5fvdmI';
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/analytics/v3/rest'];
    const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';
    const REDIRECT_URI = 'https://eportfoliomatijasic.netlify.app/html/chart.html';

    let isAuthenticated = false;
    let tokenClient;

    // Funkcija koja se poziva kad je korisnik autentificiran
    function handleCredentialResponse(response) {
      console.log(response);
      const credential = response.credential;

      if (credential) {
        const token = credential; // Ako je "credential" JWT token, koristit ćemo ga direktno
        localStorage.setItem("access_token", token); // Spremite ga u localStorage
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

      // Pokreće prompt za prijavu
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
      if (!token) {
        console.error("Nema pristupnog tokena. Prijavite se ponovno.");
        return;
      }

      try {
        const response = await fetch('https://eportfoliomatijasic.netlify.app/.netlify/functions/analytics', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Slanje tokena u zaglavlju
          },
        });

        const data = await response.json();
        renderChart(data);
      } catch (err) {
        console.error("Greška u dohvaćanju podataka:", err);
      }
    }

    // Funkcija za renderiranje grafikona
    function renderChart(data) {
      const labels = data.rows.map(row => row[0]);  // Prilagodite prema stvarnim podacima
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
      document.querySelector('button[onclick="handleAuthClick()"]').disabled = false;  // Omogućite gumb za prijavu
    };