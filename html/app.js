import axios from 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
const cheerio = require('cheerio');
const natural = require('natural');
const TfIdf = natural.TfIdf;

// URL-ovi stranica koje želimo analizirati
const urls = [
  "https://realac5.github.io/html/home", 
  "https://realac5.github.io/html/aboutme",
  "https://realac5.github.io/html/projects",
  "https://realac5.github.io/html/project1",
  "https://realac5.github.io/html/project2",
  "https://realac5.github.io/html/project3",
  "https://realac5.github.io/html/contact",
  "https://realac5.github.io/html/cv",
];

// Kreiramo TF-IDF model
const tfidf = new TfIdf();

// Funkcija za scraping stranice
async function scrapePage(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const pageText = $("body").text();  // Možeš prilagoditi selektor prema potrebama
    return pageText;
  } catch (error) {
    console.error(`Greška pri scrapanju stranice ${url}:`, error);
    return "";
  }
}

// Funkcija za dodavanje stranica u TF-IDF model
async function addPagesToTfidf() {
  for (let url of urls) {
    const content = await scrapePage(url);
    if (content) {
      tfidf.addDocument(content);
    }
  }
}

// Funkcija za generiranje vektora za stranicu
function getPageVector(pageIndex) {
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

// Funkcija za dodavanje URL-a u korisničku povijest
function addToUserHistory(url) {
  let history = JSON.parse(localStorage.getItem('userHistory')) || [];
  if (!history.includes(url)) {
    history.push(url);
  }
  localStorage.setItem('userHistory', JSON.stringify(history));
}

// Funkcija za dohvaćanje povijesti korisnika iz localStorage
function getUserHistory() {
  return JSON.parse(localStorage.getItem('userHistory')) || [];
}

// Funkcija za generiranje preporuka temeljenih na korisničkoj povijesti
async function getRecommendations(userHistory) {
  let pageVectors = {};
  
  await addPagesToTfidf();

  for (let i = 0; i < urls.length; i++) {
    const pageContent = await scrapePage(urls[i]);
    pageVectors[urls[i]] = getPageVector(i);
  }

  let recommendations = [];
  
  for (let page in pageVectors) {
    if (!userHistory.includes(page)) {
      const lastVisitedPage = userHistory[userHistory.length - 1];
      const similarity = cosineSimilarity(pageVectors[lastVisitedPage], pageVectors[page]);
      recommendations.push({ page, similarity });
    }
  }

  recommendations.sort((a, b) => b.similarity - a.similarity);
  return recommendations.map(rec => rec.page);
}

// Praćenje korisničke povijesti
document.addEventListener("DOMContentLoaded", () => {
  // Dodavanje trenutne stranice u povijest
  const currentPage = window.location.href;
  addToUserHistory(currentPage);

  // Dohvaćanje povijesti
  let userHistory = getUserHistory();
  console.log(userHistory);

  // Dohvaćanje preporuka
  getRecommendations(userHistory).then(recommendations => {
    console.log("Preporučene stranice:", recommendations);
    displayRecommendations(recommendations);  // Prikaz preporuka na stranici
  });
});

// Funkcija za prikaz preporuka u HTML-u
function displayRecommendations(recommendations) {
  const recommendationsList = document.getElementById('recommendations-list');
  recommendationsList.innerHTML = '';  // Čisti prethodne preporuke

  recommendations.forEach(page => {
    const listItem = document.createElement('li');
    listItem.textContent = page;
    recommendationsList.appendChild(listItem);
  });
}
