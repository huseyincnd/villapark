// src/pages/api/categories/index.js
import dbConnect from '../../../../lib/mongodb';
import Category from '../../../../models/Category';
import Product from '../../../../models/Product';
import { isAuthenticated } from '../../../../lib/auth';

async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    // Tüm kategorileri getir
    case 'GET':
      try {
        // Tüm kategorileri al
        const categories = await Category.find({});
        
        // Her kategori için ürün sayısını hesapla
        const categoriesWithProductCounts = await Promise.all(
          categories.map(async (category) => {
            const productCount = await Product.countDocuments({ categoryId: category._id });
            const categoryObj = category.toObject();
            categoryObj.productCount = productCount;
            return categoryObj;
          })
        );
        
        // Admin değişikliklerinin anında gözükmesi için cache kaldırıldı
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(200).json(categoriesWithProductCounts);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    // Yeni kategori ekle (sadece admin için)
    case 'POST':
      try {
        // POST isteği yapan kişi admin mi kontrol et (middleware ile)
        const category = await Category.create(req.body);
        res.status(201).json(category);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}

// GET isteği için normal handler, POST isteği için isAuthenticated middleware'i ile koruma
export default function allowCors(req, res) {
  // GET istekleri herkes tarafından yapılabilir
  if (req.method === 'GET') {
    return handler(req, res);
  }

  // POST, PUT, DELETE istekleri için yetkilendirme gerekli
  return isAuthenticated(handler)(req, res);
}