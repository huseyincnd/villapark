// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı gereklidir'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    required: [true, 'Ürün fiyatı gereklidir']
  },
  image: {
    type: String,
    default: ''
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori ID gereklidir']
  },
  order: {
    type: Number,
    default: 999 // Yüksek bir değer, böylece sıra belirtilmemiş ürünler en sona eklenir
  }
}, { 
  timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);