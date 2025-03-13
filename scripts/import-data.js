// scripts/import-data.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// MongoDB bağlantısı
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI ortam değişkeni tanımlanmamış');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  });

// Modelleri tanımla
const CategorySchema = new mongoose.Schema({
  name: String,
  image: String
});

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  image: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
});

const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);

// JSON dosyasını oku
const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/menu.json'), 'utf8'));

async function importData() {
  try {
    // Önce tüm verileri temizle
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Mevcut veriler temizlendi');
    
    // Kategorileri ekle
    for (const cat of menuData.categories) {
      const category = new Category({
        name: cat.name,
        image: cat.image || ''
      });
      
      const savedCategory = await category.save();
      console.log(`Kategori eklendi: ${cat.name}`);
      
      // Bu kategoriye ait ürünleri ekle
      for (const prod of cat.products) {
        const product = new Product({
          name: prod.name,
          description: prod.description || '',
          price: prod.price,
          image: prod.image || '',
          categoryId: savedCategory._id
        });
        
        await product.save();
        console.log(`Ürün eklendi: ${prod.name}`);
      }
    }
    
    console.log('Veriler başarıyla içe aktarıldı');
    process.exit(0);
  } catch (error) {
    console.error('Veri içe aktarma hatası:', error);
    process.exit(1);
  }
}

importData();