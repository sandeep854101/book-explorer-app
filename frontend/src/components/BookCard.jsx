import React from 'react'

const BookCard = ({ book, onSelect }) => {
  const handleClick = () => {
    onSelect(book)
  }

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
    <div className="book-card" onClick={handleClick}>
      <div className="book-image">
        <img src={book.imageUrl} alt={book.title} />
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-price">£{book.price.toFixed(2)}</p>
        <div className="book-rating">
          {renderRatingStars(book.rating)}
        </div>
        <p className={`book-availability ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {book.stock > 0 ? `In stock (${book.stock})` : 'Out of stock'}
        </p>
      </div>
    </div>
  )
}

export default BookCard