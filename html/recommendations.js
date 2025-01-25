document.addEventListener("DOMContentLoaded", () => {
    // Funkcija za dohvaćanje kolačića
    function getCookie(name) {
      let cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        let [key, value] = cookie.split('=');
        key = key.trim();
        if (key === name) {
          return decodeURIComponent(value);
        }
      }
      return null;
    }
  
    // Funkcija za postavljanje kolačića
    function setCookie(name, value, days) {
      const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }
  
    // Funkcija za ažuriranje korisničke povijesti
    function updateUserHistory(pageName) {
        let userHistory = getCookie('userHistory');
        userHistory = userHistory ? JSON.parse(userHistory) : [];
        
        // Uvijek staviti trenutnu stranicu na kraj
        if (userHistory[userHistory.length - 1] !== pageName) {
            userHistory.push(pageName);
            setCookie('userHistory', JSON.stringify(userHistory), 1); // Kolačić vrijedi 1 dan
        }
    }
  
    // Praćenje trenutne stranice
    let currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    updateUserHistory(currentPage);
  
    // Dohvaćanje korisničke povijesti iz kolačića
    let userHistory = getCookie('userHistory');
    userHistory = userHistory ? JSON.parse(userHistory) : [];
    console.log("Korisnička povijest (kolačići):", userHistory);
  
    // Stranice s njihovim stvarnim sadržajem
    let pages = [
        {
          name: "home",
          content: "O meni\n\nTeo Matijašić\n“Stvaram desktop/web i mobilne aplikacije s jednostavnim i privlačnim sučeljem.” Putem ovoga web sjedišta, detaljnije me možeš upoznati, otkriti moje specijalnosti i vještine, pregledati moje projekte i radove ili me kontaktirati za moguću suradnju."
        },
        {
          name: "aboutme",
          content: "Kratke informacije o meni!\n\nTeo Matijašić\n“Sve projekte, koje sam izradio za fakultet, karakterizira jednostavnost, praktičnost i usmjerenost na korisnika.”\n\nOPĆENITO\nJa sam student Fakulteta informatike i digitalnih tehnologija u Rijeci koji voli učiti nove stvari i biti uporan u savladavanju novih vještina. Moji radovi obuhvaćaju područja istraživanja korisnika, UI/UX dizajna i razvoja različitih vrsta aplikacija."
        },
        {
          name: "projects",
          content: "Moji projekti i radovi!\n\nWeb aplikacija za stručnu praksu\nPodručje:Web razvoj, Backend-Middle-Frontend, Web aplikacija\nProblem: Razvoj cjelokupne web aplikacije za evidenciju stručne prakse na fakultetima\nRezultat: Kreirana funkcionalna web aplikacija s brojnim mogućnostima, spremno za produkciju."
        },
        {
          name: "project1",
          content: "Web aplikacija (PostgreSQL/.NET/React)\nAutor: Teo Matijašić\nOpis Projekta\nOvaj projekt je podrazumijevao izradu web aplikacije za evidenciju stručne prakse na fakultetu. Pritom su kreirani svi osnovni dijelovi web aplikacije, od baze podataka u PostgreSQL-u, srednjeg dijela u C# i .NET-u te frontenda u React-u."
        },
        {
          name: "project2",
          content: "Dizajn aplikacije Servisly\nAutor: Teo Matijašić\nOpis Projekta\nOvaj projekt je podrazumijevao izradu cjelokupnoga dizajna aplikacije za online naručivanje za servis automobila. Provedene su sve faze UI i UX dizajna, uključujući istraživanje korisnika, analize konkurencije, wireframe, mockup, prototip i testiranje s korisnicima."
        },
        {
          name: "project3",
          content: "Aplikacija za putne naloge\nAutor: Teo Matijašić\nOpis Projekta\nOvaj projekt je podrazumijevao izradu cjelokupne aplikacije za evidenciju putnih naloga u Clarionu. Temelj projekta bio je papirnati putni nalog na temelju kojega je kreiran model podataka koji je razrađen u cjelokupnu aplikaciju."
        },
        {
          name: "contact",
          content: "Kontaktiraj me!\nTeo Matijašić\nBroj telefona: 091 954 6450\nEmail: teo12matijasic@gmail.com\nDruštvene mreže:\nPošalji mi Email!"
        },
        {
          name: "cv",
          content: "Moj životopis (CV)\nPreuzmi CV"
        },
        {
            name: "chart",
            content: "Google Analytics Podaci\n\nOdaberite vremenski raspon:\n\n- Danas\n- Posljednjih 7 dana\n- Posljednjih mjesec dana\n- Posljednja 3 mjeseca\n\nUčitaj podatke\n\nPreporučene stranice\n\nObriši povijest\n\nPrijavite se s Google računom\nOdjavite se"
        }
      ];
  
    // Dohvaćanje preporuka
    let recommendations = getRecommendations(currentPage, userHistory.slice(-3, -1), pages);
    displayRecommendations(recommendations);
  
    // Funkcija za izračunavanje Cosine Similarity
    function cosineSimilarity(vecA, vecB) {
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
  
      for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
      }
  
      normA = Math.sqrt(normA);
      normB = Math.sqrt(normB);
  
      return dotProduct / (normA * normB);
    }

  
    // Funkcija za generiranje vektora značajki stranice
      function generateTFIDFVector(content, allContents) {
        const allWords = allContents.join(' ').split(/\s+/); // Sve riječi u svim sadržajima
        const uniqueWords = [...new Set(allWords)]; // Jedinstvene riječi
        const wordFrequency = {}; // Učestalost riječi u trenutnom sadržaju
        const documentFrequency = {}; // Broj dokumenata u kojima se pojavljuje riječ
      
        // Broj dokumenata
        const numDocuments = allContents.length;
      
        // Izračunaj učestalost riječi u trenutnom sadržaju
        uniqueWords.forEach(word => {
          const wordCountInContent = content.split(/\s+/).filter(w => w === word).length;
          wordFrequency[word] = wordCountInContent;
      
          // Izračunaj broj dokumenata u kojima se riječ pojavljuje
          documentFrequency[word] = allContents.filter(text => text.includes(word)).length;
        });
      
        // Generiraj TF-IDF vektor
        return uniqueWords.map(word => {
          const tf = wordFrequency[word] || 0; // Term Frequency
          const idf = Math.log(numDocuments / (documentFrequency[word] || 1)); // Inverse Document Frequency
          return tf * idf; // TF-IDF
        });
      }
      
  
    // Funkcija za dohvaćanje preporuka
      function getRecommendations(currentPage, recentHistory, pages) {
        let allContents = pages.map(page => page.content);
        let recommendedPages = [];
        let currentPageData = pages.find(page => page.name === currentPage);
        currentPageVector = generateTFIDFVector(currentPageData.content, allContents);

          let recentVectors = recentHistory
            .map(url => {
                let page = pages.find(p => p.name === url);
                if (!page) {
                console.warn(`Stranica "${url}" nije pronađena u popisu stranica.`);
                return Array(allContents.join(' ').split(/\s+/).length).fill(0); // Vraćamo vektor nula za nepostojeće stranice
                }
                return generateTFIDFVector(page.content, allContents);
            });
    
        // Izračunaj sličnost svake stranice s trenutnom i zadnjim posjećenima
        pages.forEach(page => {
            if (page.name !== currentPage) {
              let pageVector = generateTFIDFVector(page.content, allContents);
              let similarityScore = 0;
          
                // Veći prioritet trenutnoj stranici
                similarityScore += 2 * cosineSimilarity(currentPageVector, pageVector);

                // Manji prioritet zadnje posjećenim stranicama
                recentVectors.forEach(recentVector => {
                similarityScore += cosineSimilarity(recentVector, pageVector);
                });
          
              recommendedPages.push({ page: page.name, score: similarityScore });
            }
          });
    
        // Sortiraj prema sličnosti i uzmi top 3
        recommendedPages.sort((a, b) => b.score - a.score);
        return recommendedPages.slice(0, 3);
      }
  
    // Funkcija za prikaz preporuka na stranici
    function displayRecommendations(recommendations) {
      const recommendationsList = document.getElementById("recommendations-list");
      recommendations.forEach(rec => {
        let listItem = document.createElement("li");
        let link = document.createElement("a");
        if(rec.page == "home"){
          link.textContent = "Home";
          link.href = "home.html";
        }
        else if(rec.page == "projects") {
          link.textContent = "Projekti";
          link.href = "projects.html";
        }
        else if(rec.page == "contact") {
          link.textContent = "Kontakt";
          link.href = "contact.html";
        }
        else if(rec.page == "cv") {
          link.textContent = "CV";
          link.href = "cv.html";
        }
        else if(rec.page == "aboutme") {
          link.textContent = "O meni";
          link.href = "aboutme.html";
        }
        else if(rec.page == "chart") {
          link.textContent = "Analitika";
          link.href = "chart.html";
        }
        else if(rec.page == "project1") {
          link.textContent = "Projekt 1";
          link.href = "project1.html";
        }
        else if(rec.page == "project2") {
          link.textContent = "Projekt 2";
          link.href = "project2.html";
        }
        else if(rec.page == "project3") {
          link.textContent = "Projekt 3";
          link.href = "project3.html";
        }
        listItem.appendChild(link);
        recommendationsList.appendChild(listItem);
      });
    }
  });
  
  function clearUserHistory() {
    document.cookie = "userHistory=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    console.log("Korisnička povijest obrisana.");
  }