import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// GET /api/books - Get paginated list of books with optional filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter object based on query parameters
    const filter = {};
    
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }
    
    if (req.query.rating) {
      filter.rating = { $gte: parseInt(req.query.rating) };
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.inStock) {
      if (req.query.inStock === 'true') {
        filter.stock = { $gt: 0 };
      } else if (req.query.inStock === 'false') {
        filter.stock = 0;
      }
    }
    
    // Execute query with filters
    const books = await Book.find(filter)
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit);
    
    const totalCount = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);
    
    res.json({
      books,
      pagination: {
        current: page,
        total: totalPages,
        count: books.length,
        totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /api/books/:id - Get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST /api/refresh - Trigger a new scraping process
router.post('/refresh', async (req, res) => {
  try {
    // In a real application, you might want to use a message queue
    // or background job processor for this task
    res.json({ message: 'Refresh process started. This may take several minutes.' });
    
    // Run the scraper in the background
    import('../../scraper/index.js')
      .then(module => module.default())
      .catch(err => console.error('Error running scraper:', err));
      
  } catch (error) {
    console.error('Error triggering refresh:', error);
    res.status(500).json({ error: 'Failed to start refresh process' });
  }
});

export default router;