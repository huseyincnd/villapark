// models/Category.js
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kategori adı gereklidir'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

// Eğer model zaten tanımlıysa onu kullan, değilse yeni model oluştur
// Bu, Next.js'in hot reloading özelliği için gereklidir
export default mongoose.models.Category || mongoose.model('Category', CategorySchema);