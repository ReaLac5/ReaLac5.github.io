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
  
      if (!userHistory.includes(pageName)) {
        userHistory.push(pageName);
        setCookie('userHistory', JSON.stringify(userHistory), 7); // Kolačić vrijedi 7 dana
      }
    }
  
    // Praćenje trenutne stranice
    let currentPage = window.location.pathname;
    updateUserHistory(currentPage);
  
    // Dohvaćanje korisničke povijesti iz kolačića
    let userHistory = getCookie('userHistory');
    userHistory = userHistory ? JSON.parse(userHistory) : [];
    console.log("Korisnička povijest (kolačići):", userHistory);
  
    // Stranice s njihovim stvarnim sadržajem
    let pages = [
      {
        name: "/home",
        content: "O meni\n\nTeo Matijašić\n“Stvaram desktop/web i mobilne aplikacije s jednostavnim i privlačnim sučeljem.”",
      },
      {
        name: "/products",
        content: "Pregled proizvoda\nOvdje možete pregledati sve proizvode koje nudimo.",
      },
      {
        name: "/about",
        content: "Informacije o meni\nStudent informatike i tehnologije s velikom strašću prema razvoju aplikacija.",
      },
      {
        name: "/contact",
        content: "Kontaktirajte nas putem emaila ili telefona za više informacija.",
      },
    ];
  
    // Dohvaćanje preporuka
    let recommendations = getRecommendations(userHistory, pages);
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
  
    // Funkcija za dohvaćanje preporuka
    function getRecommendations(userHistory, pages) {
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
  });
  