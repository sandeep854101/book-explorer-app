import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import Filters from './Filters';
import BookDetail from './BookDetail';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalCount: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    rating: '',
    minPrice: '',
    maxPrice: '',
    inStock: ''
  });
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [pagination.current, filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 20,
        ...filters
      });

      const response = await fetch(`https://book-explorer-app-60az.onrender.com/api/books?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBooks(data.books);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total) {
      setPagination(prev => ({ ...prev, current: newPage }));
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null);
  };

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchBooks}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>Book Explorer</h1>
        <p>Discover your next favorite read from our collection</p>
      </header>

      <Filters filters={filters} onFilterChange={handleFilterChange} />
      
      {loading ? (
        <div className="loading">Loading books...</div>
      ) : (
        <>
          <div className="results-info">
            <p>Showing {pagination.count} of {pagination.totalCount} books</p>
          </div>
          
          <div className="books-grid">
            {books.map(book => (
              <BookCard 
                key={book._id} 
                book={book} 
                onSelect={handleBookSelect}
              />
            ))}
          </div>
          
          {pagination.total > 1 && (
            <div className="pagination">
              <button 
                disabled={pagination.current === 1}
                onClick={() => handlePageChange(pagination.current - 1)}
              >
                Previous
              </button>
              
              <span>Page {pagination.current} of {pagination.total}</span>
              
              <button 
                disabled={pagination.current === pagination.total}
                onClick={() => handlePageChange(pagination.current + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      {selectedBook && (
        <BookDetail book={selectedBook} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default BookList;