import axios from 'axios';
import * as cheerio from 'cheerio';

// Convert rating text to numerical value
function convertRatingToNumber(ratingText) {
  const ratingMap = {
    'One': 1,
    'Two': 2,
    'Three': 3,
    'Four': 4,
    'Five': 5
  };
  
  return ratingMap[ratingText] || 0;
}

// Extract book data from a single product element
function extractBookData($, element, baseUrl) {
  const title = $(element).find('h3 a').attr('title');
  const priceText = $(element).find('.price_color').text();
  const price = parseFloat(priceText.replace('£', ''));
  
  const availabilityText = $(element).find('.instock').text().trim();
  const availability = availabilityText.includes('In stock') ? 'In stock' : 'Out of stock';
  const stock = availability === 'In stock' ? parseInt(availabilityText.match(/\d+/)[0]) : 0;
  
  const ratingClass = $(element).find('.star-rating').attr('class');
  const ratingText = ratingClass.split(' ')[1];
  const rating = convertRatingToNumber(ratingText);
  
  const relativeUrl = $(element).find('h3 a').attr('href');
  const detailUrl = new URL(relativeUrl, baseUrl).href;
  
  const imageRelativeUrl = $(element).find('img').attr('src');
  const imageUrl = new URL(imageRelativeUrl, baseUrl).href;
  
  return {
    title,
    price,
    stock,
    availability,
    rating,
    detailUrl,
    imageUrl,
    lastUpdated: new Date()
  };
}

// Scrape a single page of books
async function scrapePage(url) {
  try {
    console.log(`Scraping page: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const books = [];
    
    $('.product_pod').each((index, element) => {
      const bookData = extractBookData($, element, url);
      books.push(bookData);
    });
    
    // Check if there's a next page
    const nextButton = $('.next a');
    const nextPageUrl = nextButton.length > 0 ? new URL(nextButton.attr('href'), url).href : null;
    
    return {
      books,
      nextPageUrl
    };
  } catch (error) {
    console.error(`Error scraping page ${url}:`, error.message);
    return { books: [], nextPageUrl: null };
  }
}

// Main scraping function
export async function scrapeAllBooks() {
  let currentUrl = 'https://books.toscrape.com/';
  const allBooks = [];
  
  while (currentUrl) {
    const { books, nextPageUrl } = await scrapePage(currentUrl);
    allBooks.push(...books);
    currentUrl = nextPageUrl;
    
    // Add a small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`Scraped ${allBooks.length} books in total`);
  return allBooks;
}