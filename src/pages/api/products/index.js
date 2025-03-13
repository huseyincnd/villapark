// src/pages/api/products/index.js
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { isAuthenticated } from '../../../../lib/auth';

async function handler(req, res) {
  const { method } = req;
  const { categoryId } = req.query;

  await dbConnect();

  switch (method) {
    // Tüm ürünleri getir
    case 'GET':
      try {
        const query = categoryId ? { categoryId } : {};
        const products = await Product.find(query).populate('categoryId');
        res.status(200).json(products);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    // Yeni ürün ekle
    case 'POST':
      try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
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