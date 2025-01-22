const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

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

// Funkcija za scraping stranice
async function scrapePage(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const pageText = $("body").text(); // Možeš prilagoditi selektor prema potrebama
    return pageText;
  } catch (error) {
    console.error(`Greška pri scrapanju stranice ${url}:`, error);
    return "";
  }
}

// Funkcija za spremanje podataka u datoteku
function saveScrapedData(data) {
  try {
    fs.writeFileSync('scrapedData.json', JSON.stringify(data, null, 2));
    console.log('Podaci su uspješno spremljeni u scrapedData.json');
  } catch (error) {
    console.error('Greška pri spremanju podataka u datoteku:', error);
  }
}

// Funkcija za scraping svih stranica
async function scrapeAllPages() {
  let scrapedData = {};
  console.log('Scraping stranica...');
  for (let url of urls) {
    const content = await scrapePage(url);
    if (content) {
      scrapedData[url] = content;
    }
  }
  saveScrapedData(scrapedData);
}

// Pokreni scraping
scrapeAllPages();
