const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

// Funkcija za scraping
async function scrapePage(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $("body").text(); // Izdvajanje cijelog tekstualnog sadržaja
  } catch (error) {
    console.error(`Greška pri scrapanju stranice ${url}:`, error);
    return "";
  }
}

// API endpoint za dohvaćanje sadržaja stranice
app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('URL parametar je obavezan');
  }

  const content = await scrapePage(url);
  res.json({ content });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
