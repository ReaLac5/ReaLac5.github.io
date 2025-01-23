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
    /*function updateUserHistory(pageName) {
      let userHistory = getCookie('userHistory');
      userHistory = userHistory ? JSON.parse(userHistory) : [];
  
      if (!userHistory.includes(pageName)) {
        userHistory.push(pageName);
        setCookie('userHistory', JSON.stringify(userHistory), 1); // Kolačić vrijedi 1 dan
      }
    }*/

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
            //content: "Google Analytics Podaci\n\nOdaberite vremenski raspon:\n- Danas\n- Posljednjih 7 dana\n- Posljednjih mjesec dana\n- Posljednja 3 mjeseca\n\nUčitaj podatke i pregledaj analitiku vezanu uz vaše stranice. Pregledajte preporučene stranice, obrišite povijest i pratite aktivnosti posjetitelja.\n\nPrijavite se s Google računom ili se odjavite prema potrebi.\n\nDostupne opcije: \n- Kontaktiraj me\n- Moj životopis\n- Analitika\n\nOvdje možete pratiti vašu online prisutnost s detaljnim uvidima u promet i angažman."
            content: "Google Analytics Podaci\n\nOdaberite vremenski raspon:\n\n- Danas\n- Posljednjih 7 dana\n- Posljednjih mjesec dana\n- Posljednja 3 mjeseca\n\nUčitaj podatke\n\nPreporučene stranice\n\nObriši povijest\n\nPrijavite se s Google računom\nOdjavite se"
        }
      ];
  
    // Dohvaćanje preporuka
    //let recommendations = getRecommendations(userHistory, pages);
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
    /*function generateFeatureVector(content, allContents) {
      const wordFrequency = {};
      const allWords = allContents.join(' ').split(/\s+/);
      const uniqueWords = [...new Set(allWords)];
  
      uniqueWords.forEach(word => {
        const wordCountInContent = content.split(/\s+/).filter(w => w === word).length;
        wordFrequency[word] = wordCountInContent;
      });
  
      return uniqueWords.map(word => wordFrequency[word] || 0);
    }*/

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
    /*function getRecommendations(userHistory, pages) {
      let allContents = pages.map(page => page.content);
      let recommendedPages = [];
  
      let userVisitedVectors = userHistory.map(url => {
        let page = pages.find(p => p.name === url);
        return page ? generateFeatureVector(page.content, allContents) : null;
      }).filter(v => v); // Filtriramo null vrijednosti
  
      pages.forEach(page => {
        let pageVector = generateFeatureVector(page.content, allContents);
        let similarityScore = 0;
  
        userVisitedVectors.forEach(userVector => {
          similarityScore += cosineSimilarity(userVector, pageVector);
        });
  
        recommendedPages.push({ page: page.name, score: similarityScore });
      });
  
      recommendedPages.sort((a, b) => b.score - a.score);
      return recommendedPages.slice(0, 3); // Top 3 preporuke
    }*/

      function getRecommendations(currentPage, recentHistory, pages) {
        let allContents = pages.map(page => page.content);
        let recommendedPages = [];
    
        // Generiraj vektore za trenutnu i zadnje posjećene stranice
        /*let currentPageVector = generateTFIDFVector(
          pages.find(page => page.name === currentPage)?.content || "",
          allContents
        );*/
        //console.log(currentPage);
        let currentPageData = pages.find(page => page.name === currentPage);
        currentPageVector = generateTFIDFVector(currentPageData.content, allContents);
        /*let recentVectors = recentHistory
          .map(url => {
            let page = pages.find(p => p.name === url);
            return page ? generateTFIDFVector(page.content, allContents) : null;
          })
          .filter(v => v); // Filtriraj null vrijednosti*/

          let recentVectors = recentHistory
            .map(url => {
                let page = pages.find(p => p.name === url);
                if (!page) {
                console.warn(`Stranica "${url}" nije pronađena u popisu stranica.`);
                return Array(allContents.join(' ').split(/\s+/).length).fill(0); // Vraćamo vektor nula za nepostojeće stranice
                }
                return generateTFIDFVector(page.content, allContents);
            });

          //console.log("Trenutna stranica:", currentPage);
//console.log("Sadržaj trenutne stranice:", currentPageData ? currentPageData.content : "Nije pronađeno");
//console.log("Vektor trenutne stranice:", currentPageVector);
//console.log("Svi vektori stranica:", pages.map(p => generateTFIDFVector(p.content, allContents)));


          //console.log("Vektori stranica:", pages.map(p => generateTFIDFVector(p.content, allContents)));



          //console.log("Vektor trenutne stranice:", currentPageVector);
           // console.log("Vektori zadnjih stranica:", recentVectors);

    
        // Izračunaj sličnost svake stranice s trenutnom i zadnjim posjećenima
        pages.forEach(page => {
            if (page.name !== currentPage) {
              let pageVector = generateTFIDFVector(page.content, allContents);
              let similarityScore = 0;
          
              // Sličnost s trenutnom stranicom
              /*if (currentPageVector) {
                similarityScore += cosineSimilarity(currentPageVector, pageVector);
              }
          
              // Sličnost sa zadnje posjećenom stranicom
              if (recentVectors.length > 0) {
                similarityScore += cosineSimilarity(recentVectors[recentVectors.length - 1], pageVector);
              }*/

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
        return recommendedPages.slice(0, 3); // Top 3 preporuke
      }
  
    // Funkcija za prikaz preporuka na stranici
    function displayRecommendations(recommendations) {
      const recommendationsList = document.getElementById("recommendations-list");
      recommendations.forEach(rec => {
        let listItem = document.createElement("li");
        let link = document.createElement("a");
        if(rec.page == "home"){
          listItem.textContent = "Home";
          link.href = "/home";
        }
        else if(rec.page == "projects") {
          listItem.textContent = "Projekti";
          link.href = "/projects";
        }
        else if(rec.page == "contact") {
          listItem.textContent = "Kontakt";
          link.href = "/contact";
        }
        else if(rec.page == "cv") {
          listItem.textContent = "CV";
          link.href = "/cv";
        }
        else if(rec.page == "aboutme") {
          listItem.textContent = "O meni";
          link.href = "/aboutme";
        }
        else if(rec.page == "chart") {
          listItem.textContent = "Analitika";
          link.href = "/chart";
        }
        else if(rec.page == "project1") {
          listItem.textContent = "Projekt 1";
          link.href = "/project1";
        }
        else if(rec.page == "project2") {
          listItem.textContent = "Projekt 2";
          link.href = "/project2";
        }
        else if(rec.page == "project3") {
          listItem.textContent = "Projekt 3";
          link.href = "/project3";
        }
        //listItem.textContent = rec.page;
        listItem.appendChild(link);
        recommendationsList.appendChild(listItem);
      });
    }
  });
  
  function clearUserHistory() {
    document.cookie = "userHistory=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    console.log("Korisnička povijest obrisana.");
  }