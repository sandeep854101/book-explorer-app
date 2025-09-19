import { connectToDatabase } from './database.js';
import { scrapeAllBooks } from './book-scraper.js';
import Book from './models/Books.js';

async function main() {
  try {
    console.log('Starting book scraping process...');
    
    // Connect to database
    await connectToDatabase();
    console.log('Connected to database successfully');
    
    // Scrape all books
    const books = await scrapeAllBooks();
    
    // Save books to database
    console.log('Saving books to database...');
    for (const bookData of books) {
      // Update if exists, insert if not
      await Book.findOneAndUpdate(
        { title: bookData.title },
        bookData,
        { upsert: true, new: true }
      );
    }
    
    console.log('Scraping completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error in scraping process:', error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;