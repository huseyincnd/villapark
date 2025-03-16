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
        
        // Önce ürünleri çekelim
        let products = await Product.find(query).populate('categoryId');
        
        // Sıralamayı manuel olarak yapalım
        products.sort((a, b) => {
          // a orderı yoksa (veya null/undefined ise) en sona koy (yüksek değer ver)
          const orderA = a.order === undefined || a.order === null ? 9999 : a.order;
          // b orderı yoksa (veya null/undefined ise) en sona koy (yüksek değer ver)
          const orderB = b.order === undefined || b.order === null ? 9999 : b.order;
          
          // Küçükten büyüğe sırala
          return orderA - orderB;
        });
        
        res.status(200).json(products);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    // Yeni ürün ekle
    case 'POST':
      try {
        const { categoryId, order } = req.body;
        
        // 999 özel değeri veya order belirtilmemiş ise normal ekleme yap
        if (!order || order === 999) {
          const product = await Product.create(req.body);
          return res.status(201).json(product);
        }
        
        // Aynı kategoride aynı order değerine sahip başka bir ürün var mı kontrol et
        if (categoryId) {
          // İlk önce, belirtilen sıradaki ve sonrasındaki ürünleri (999 hariç) bir ileriye kaydır
          await Product.updateMany(
            { 
              categoryId: categoryId, 
              order: { $gte: order, $ne: 999 } // Belirtilen sıra ve sonrası, ama 999 değil
            }, 
            { $inc: { order: 1 } } // Sıra değerini 1 arttır
          );
          
          // Şimdi yeni ürünü belirtilen sıra numarasına ekle
          const product = await Product.create(req.body);
          res.status(201).json(product);
        } else {
          const product = await Product.create(req.body);
          res.status(201).json(product);
        }
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