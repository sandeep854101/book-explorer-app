import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  stock: {
    type: Number,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    index: true
  },
  detailUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for better search performance
bookSchema.index({ title: 'text' });
bookSchema.index({ price: 1, rating: -1 });

export default mongoose.model('Book', bookSchema);