const natural = require('natural');
const fs = require('fs');
const TfIdf = natural.TfIdf;

// Funkcija za dohvaćanje podataka iz spremljene datoteke
function loadScrapedData() {
  try {
    const data = fs.readFileSync('scrapedData.json');
    return JSON.parse(data);
  } catch (error) {
    console.error('Greška pri učitavanju podataka iz datoteke:', error);
    return {};
  }
}

// Funkcija za dodavanje stranica u TF-IDF model
function addPagesToTfidf(tfidf, scrapedData) {
  for (let url in scrapedData) {
    const content = scrapedData[url];
    tfidf.addDocument(content);
  }
}

// Funkcija za generiranje vektora za stranicu
function getPageVector(tfidf, pageIndex) {
  const vector = [];
  tfidf.listTerms(pageIndex).forEach(item => {
    vector.push(tfidf.tfidf(item.term, pageIndex)); // Generiramo TF-IDF vrijednosti za sadržaj stranica
  });
  return vector;
}

// Funkcija za izračunavanje kosinusne sličnosti između dvaju vektora
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Funkcija za generiranje preporuka temeljenih na korisničkoj povijesti
function getRecommendations(userHistory) {
  let recommendations = [];
  let scrapedData = loadScrapedData();

  if (Object.keys(scrapedData).length === 0) {
    console.log("Nema podataka za analizu.");
    return recommendations;
  }

  const tfidf = new TfIdf();
  addPagesToTfidf(tfidf, scrapedData);

  let pageVectors = {};
  for (let i = 0; i < Object.keys(scrapedData).length; i++) {
    pageVectors[Object.keys(scrapedData)[i]] = getPageVector(tfidf, i);
  }

  // Generiranje preporuka na temelju kosinusne sličnosti
  for (let page in pageVectors) {
    if (!userHistory.includes(page)) {
      const lastVisitedPage = userHistory[userHistory.length - 1];
      const similarity = cosineSimilarity(pageVectors[lastVisitedPage], pageVectors[page]);
      recommendations.push({ page, similarity });
    }
  }

  // Sortiranje preporuka po sličnosti
  recommendations.sort((a, b) => b.similarity - a.similarity);
  return recommendations.map(rec => rec.page);
}

// Praćenje korisničke povijesti i generiranje preporuka
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.href;

  let userHistory = JSON.parse(localStorage.getItem('userHistory')) || [];
  userHistory.push(currentPage);  // Dodaj trenutnu stranicu u povijest
  localStorage.setItem('userHistory', JSON.stringify(userHistory));

  const recommendations = getRecommendations(userHistory);
  console.log("Preporučene stranice:", recommendations);
  displayRecommendations(recommendations); // Prikaz preporuka na stranici
});

// Funkcija za prikaz preporuka u HTML-u
function displayRecommendations(recommendations) {
  const recommendationsList = document.getElementById('recommendations-list');
  recommendationsList.innerHTML = ''; // Čisti prethodne preporuke

  recommendations.forEach(page => {
    const listItem = document.createElement('li');
    listItem.textContent = page;
    recommendationsList.appendChild(listItem);
  });
}
