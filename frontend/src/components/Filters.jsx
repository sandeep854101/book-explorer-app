import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaStar, FaPoundSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Filters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Update mobile view state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (value) => {
    handleFilterChange('search', value);
  };

  const handleRatingChange = (value) => {
    handleFilterChange('rating', value);
  };

  const handleMinPriceChange = (value) => {
    handleFilterChange('minPrice', value);
  };

  const handleMaxPriceChange = (value) => {
    handleFilterChange('maxPrice', value);
  };

  const handleStockChange = (value) => {
    handleFilterChange('inStock', value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      rating: '',
      minPrice: '',
      maxPrice: '',
      inStock: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Render star ratings for visual appeal
  const renderRatingOptions = () => {
    return [1, 2, 3, 4, 5].map(rating => (
      <option key={rating} value={rating}>
        {rating} {rating === 1 ? 'Star' : 'Stars'} & Up
      </option>
    ));
  };

  // Mobile filters toggle
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Desktop filters view
  const renderDesktopFilters = () => (
    <div className="filters-desktop">
      <div className="filter-group">
        <div className="filter-input-with-icon">
          <FaSearch className="input-icon" />
          <input
            type="text"
            id="search"
            placeholder="Search book titles..."
            value={localFilters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="rating" className="filter-label">
          <FaStar className="filter-icon" />
          Minimum Rating
        </label>
        <select
          id="rating"
          value={localFilters.rating}
          onChange={(e) => handleRatingChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Any Rating</option>
          {renderRatingOptions()}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaPoundSign className="filter-icon" />
          Price Range
        </label>
        <div className="price-range">
          <div className="price-input-container">
            <input
              type="number"
              placeholder="Min"
              min="0"
              step="0.01"
              value={localFilters.minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="price-input"
            />
            <span className="currency-symbol">£</span>
          </div>
          <span className="price-range-separator">to</span>
          <div className="price-input-container">
            <input
              type="number"
              placeholder="Max"
              min="0"
              step="0.01"
              value={localFilters.maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="price-input"
            />
            <span className="currency-symbol">£</span>
          </div>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Availability</label>
        <div className="availability-options">
          <button
            type="button"
            className={`availability-btn ${localFilters.inStock === '' ? 'active' : ''}`}
            onClick={() => handleStockChange('')}
          >
            All
          </button>
          <button
            type="button"
            className={`availability-btn ${localFilters.inStock === 'true' ? 'active' : ''}`}
            onClick={() => handleStockChange('true')}
          >
            <FaCheckCircle className="btn-icon" />
            In Stock
          </button>
          <button
            type="button"
            className={`availability-btn ${localFilters.inStock === 'false' ? 'active' : ''}`}
            onClick={() => handleStockChange('false')}
          >
            <FaTimesCircle className="btn-icon" />
            Out of Stock
          </button>
        </div>
      </div>

      <button className="clear-filters-btn" onClick={clearFilters}>
        <FaTimes className="btn-icon" />
        Clear Filters
      </button>
    </div>
  );

  // Mobile filters view
  const renderMobileFilters = () => (
    <>
      <button className="mobile-filter-toggle" onClick={toggleMobileFilters}>
        <FaFilter className="btn-icon" />
        Filters
        {Object.values(localFilters).some(filter => filter !== '') && (
          <span className="active-filters-dot"></span>
        )}
      </button>

      {showMobileFilters && (
        <div className="mobile-filters-overlay">
          <div className="mobile-filters-content">
            <div className="mobile-filters-header">
              <h3>Filters</h3>
              <button className="close-filters-btn" onClick={toggleMobileFilters}>
                <FaTimes />
              </button>
            </div>

            <div className="filter-group">
              <label htmlFor="mobile-search" className="filter-label">
                Search
              </label>
              <input
                type="text"
                id="mobile-search"
                placeholder="Search book titles..."
                value={localFilters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="mobile-rating" className="filter-label">
                Minimum Rating
              </label>
              <select
                id="mobile-rating"
                value={localFilters.rating}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="filter-select"
              >
                <option value="">Any Rating</option>
                {renderRatingOptions()}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range (£)</label>
              <div className="price-inputs-row">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  step="0.01"
                  value={localFilters.minPrice}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                  className="price-input"
                />
                <span className="price-range-separator">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  step="0.01"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  className="price-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Availability</label>
              <div className="availability-options-mobile">
                <button
                  type="button"
                  className={`availability-btn ${localFilters.inStock === '' ? 'active' : ''}`}
                  onClick={() => handleStockChange('')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`availability-btn ${localFilters.inStock === 'true' ? 'active' : ''}`}
                  onClick={() => handleStockChange('true')}
                >
                  In Stock
                </button>
                <button
                  type="button"
                  className={`availability-btn ${localFilters.inStock === 'false' ? 'active' : ''}`}
                  onClick={() => handleStockChange('false')}
                >
                  Out of Stock
                </button>
              </div>
            </div>

            <div className="mobile-filters-actions">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All
              </button>
              <button className="apply-filters-btn" onClick={toggleMobileFilters}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="filters-container">
      {isMobileView ? renderMobileFilters() : renderDesktopFilters()}
    </div>
  );
};

export default Filters;