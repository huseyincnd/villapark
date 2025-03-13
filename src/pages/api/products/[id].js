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
