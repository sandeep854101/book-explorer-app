import React from 'react'

const BookDetail = ({ book, onClose }) => {
  const renderRatingStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          {i <= rating ? '★' : '☆'}
        </span>
      )
    }
    return stars
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="book-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        <div className="book-detail-content">
          <div className="book-detail-image">
            <img src={book.imageUrl} alt={book.title} />
          </div>
          
          <div className="book-detail-info">
            <h2>{book.title}</h2>
            
            <div className="detail-row">
              <span className="label">Price:</span>
              <span className="value">£{book.price.toFixed(2)}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Rating:</span>
              <span className="value">
                {renderRatingStars(book.rating)} ({book.rating}/5)
              </span>
            </div>
            
            <div className="detail-row">
              <span className="label">Availability:</span>
              <span className={`value ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {book.stock > 0 ? `In stock (${book.stock} available)` : 'Out of stock'}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="label">Last Updated:</span>
              <span className="value">
                {new Date(book.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            
            <div className="actions">
              <a 
                href={book.detailUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="view-original-btn"
              >
                View on Original Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail