// src/pages/api/products/[id].js
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { isAuthenticated } from '../../../../lib/auth';

async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    // Belirli bir ürünü getir
    case 'GET':
  try {
    const product = await Product.findById(id)
      .populate('categoryId', '_id name'); // Sadece gerekli alanları getir
      
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Kategori bilgisini formatla
    const formattedProduct = product.toObject();
    
    // Eğer kategori populate edilmişse, formatını düzelt
    if (formattedProduct.categoryId && typeof formattedProduct.categoryId === 'object') {
      formattedProduct.categoryId = formattedProduct.categoryId._id.toString();
    }
    
    res.status(200).json(formattedProduct);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
  break;


    
    // Ürünü güncelle
    case 'PUT':
      try {
        const { categoryId, order } = req.body;
        
        // Önce mevcut ürünü bulalım, sıra değişikliği var mı görmek için
        const currentProduct = await Product.findById(id);
        if (!currentProduct) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        
        // 999 özel değeri için normal güncelleme yap
        if (order === 999) {
          const product = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          return res.status(200).json(product);
        }
        
        // Eğer kategori ve sıra değeri verilmişse ve değiştiyse
        if (categoryId && order !== undefined && currentProduct.order !== order) {
          // Eğer yeni sıra daha küçükse (ileri taşıma)
          if (order < currentProduct.order) {
            // Belirtilen yeni sıra ile eski sıra arasındaki ürünleri bir ileriye kaydır
            await Product.updateMany(
              { 
                categoryId: categoryId, 
                order: { $gte: order, $lt: currentProduct.order, $ne: 999 } // Yeni sıra ile eski sıra arasındakiler
              }, 
              { $inc: { order: 1 } } // Sıra değerini 1 arttır
            );
          } 
          // Eğer yeni sıra daha büyükse (geriye taşıma)
          else if (order > currentProduct.order && order !== 999) {
            // Belirtilen eski sıra ile yeni sıra arasındaki ürünleri bir geriye kaydır
            await Product.updateMany(
              { 
                categoryId: categoryId, 
                order: { $gt: currentProduct.order, $lte: order, $ne: 999 } // Eski sıra ile yeni sıra arasındakiler
              }, 
              { $inc: { order: -1 } } // Sıra değerini 1 azalt
            );
          }
        }
        
        // Ürünü güncelle
        const product = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!product) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json(product);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    // Ürünü sil
    case 'DELETE':
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}

// GET isteği için normal handler, diğer istekler için isAuthenticated middleware'i
export default function allowCors(req, res) {
  // GET istekleri herkes tarafından yapılabilir
  if (req.method === 'GET') {
    return handler(req, res);
  }

  // POST, PUT, DELETE istekleri için yetkilendirme gerekli
  return isAuthenticated(handler)(req, res);
}
