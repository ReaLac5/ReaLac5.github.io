document.addEventListener("DOMContentLoaded", () => {
    // Funkcija za dodavanje posjeta stranici u povijest
    function updateUserHistory(pageName) {
      let userHistory = JSON.parse(localStorage.getItem('userHistory')) || [];
  
      // Dodavanje stranice u povijest (ako nije već prisutna)
      if (!userHistory.includes(pageName)) {
        userHistory.push(pageName);
        localStorage.setItem('userHistory', JSON.stringify(userHistory));
      }
    }
  
    // Praćenje posjeta određenim stranicama
    updateUserHistory('/home');  // Kad korisnik posjeti stranicu "/home"
    updateUserHistory('/products');  // Kad korisnik posjeti stranicu "/products"
  
    // Dohvaćanje povijesti
    let userHistory = JSON.parse(localStorage.getItem('userHistory') || '[]');
    console.log(userHistory);  // Povijest posjeta korisnika
  
    // Stranice s njihovim stvarnim sadržajem
    let pages = [
      {
        name: "/home",
        content: "O meni\n\nTeo Matijašić\n“Stvaram desktop/web i mobilne aplikacije s jednostavnim i privlačnim sučeljem.” Putem ovoga web sjedišta, detaljnije me možeš upoznati, otkriti moje specijalnosti i vještine, pregledati moje projekte i radove ili me kontaktirati za moguću suradnju."
      },
      {
        name: "/about",
        content: "Kratke informacije o meni!\n\nTeo Matijašić\n“Sve projekte, koje sam izradio za fakultet, karakterizira jednostavnost, praktičnost i usmjerenost na korisnika.”\n\nOPĆENITO\nJa sam student Fakulteta informatike i digitalnih tehnologija u Rijeci koji voli učiti nove stvari i biti uporan u savladavanju novih vještina. Moji radovi obuhvaćaju područja istraživanja korisnika, UI/UX dizajna i razvoja različitih vrsta aplikacija."
      },
      {
        name: "/projects",
        content: "Moji projekti i radovi!\n\nWeb aplikacija za stručnu praksu\nPodručje:Web razvoj, Backend-Middle-Frontend, Web aplikacija\nProblem: Razvoj cjelokupne web aplikacije za evidenciju stručne prakse na fakultetima\nRezultat: Kreirana funkcionalna web aplikacija s brojnim mogućnostima, spremno za produkciju."
      },
      {
        name: "/project1",
        content: "Web aplikacija (PostgreSQL/.NET/React)\nAutor: Teo Matijašić\nOpis Projekta\nOvaj projekt je podrazumijevao izradu web aplikacije za evidenciju stručne prakse na fakultetu. Pritom su kreirani svi osnovni dijelovi web aplikacije, od baze podataka u PostgreSQL-u, srednjeg dijela u C# i .NET-u te frontenda u React-u."
      },
      {
        name: "/project2",
        content: "Dizajn aplikacije Servisly\nAutor: Teo Matijašić\nOpis Projekta\nOvaj projekt je podrazumijevao izradu cjelokupnoga dizajna aplikacije za online naručivanje za servis automobila. Provedene su sve faze UI i UX dizajna, uključujući istraživanje korisnika, analize konkurencije, wireframe, mockup, prototip i testiranje s korisnicima."
      },
      {
        name: "/project3",
        content: "Aplikacija za putne naloge\nAutor: Teo Matijašić\nOpis Projekta\nOvaj projekt je podrazumijevao izradu cjelokupne aplikacije za evidenciju putnih naloga u Clarionu. Temelj projekta bio je papirnati putni nalog na temelju kojega je kreiran model podataka koji je razrađen u cjelokupnu aplikaciju."
      },
      {
        name: "/contact",
        content: "Kontaktiraj me!\nTeo Matijašić\nBroj telefona: 091 954 6450\nEmail: teo12matijasic@gmail.com\nDruštvene mreže:\nPošalji mi Email!"
      },
      {
        name: "/cv",
        content: "Moj životopis (CV)\nPreuzmi CV"
      }
    ];
  
    // Dohvaćanje sadržaja stranica (simulacija)
    let recommendations = getRecommendations(userHistory, pages);
    displayRecommendations(recommendations);
  });
  
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
  
  // Funkcija za generiranje vektora značajki stranice pomoću jednostavne metodologije (npr. TF-IDF)
  function generateFeatureVector(content, allContents) {
    const wordFrequency = {};
    const allWords = allContents.join(' ').split(/\s+/);
    const uniqueWords = [...new Set(allWords)];
  
    uniqueWords.forEach(word => {
      const wordCountInContent = content.split(/\s+/).filter(w => w === word).length;
      wordFrequency[word] = wordCountInContent;
    });
  
    return uniqueWords.map(word => wordFrequency[word] || 0);
  }
  
  // Funkcija za dohvaćanje preporuka na temelju korisničke povijesti
  function getRecommendations(userHistory, pages) {
    let allContents = pages.map(page => page.content);
    let recommendedPages = [];
  
    // Generiramo vektore za stranice koje je korisnik posjetio
    let userVisitedVectors = userHistory.map(url => {
      let page = pages.find(p => p.name === url);
      return generateFeatureVector(page.content, allContents);
    });
  
    // Za svaku stranicu, izračunavamo sličnost s posjećenim stranicama
    pages.forEach(page => {
      let pageVector = generateFeatureVector(page.content, allContents);
      let similarityScore = 0;
  
      userVisitedVectors.forEach(userVector => {
        similarityScore += cosineSimilarity(userVector, pageVector);
      });
  
      recommendedPages.push({ page: page.name, score: similarityScore });
    });
  
    // Sortiramo preporuke po sličnosti
    recommendedPages.sort((a, b) => b.score - a.score);
  
    // Vraćamo stranice s najboljim preporukama
    return recommendedPages.slice(0, 3); // Top 3 preporuke
  }
  
  // Funkcija za prikaz preporuka na stranici
  function displayRecommendations(recommendations) {
    const recommendationsList = document.getElementById("recommendations-list");
    recommendations.forEach(rec => {
      let listItem = document.createElement("li");
      listItem.textContent = rec.page;
      recommendationsList.appendChild(listItem);
    });
  }
  