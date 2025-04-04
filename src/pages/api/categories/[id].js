// src/pages/api/categories/[id].js
import dbConnect from '../../../../lib/mongodb';
import Category from '../../../../models/Category';
import { isAuthenticated } from '../../../../lib/auth';

async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    // Belirli bir kategoriyi getir
    case 'GET':
      try {
        const category = await Category.findById(id);
        if (!category) {
          return res.status(404).json({ success: false, error: 'Category not found' });
        }
        // Önbelleğe alma başlıklarını ekle
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
        res.status(200).json(category);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    // Kategoriyi güncelle
    case 'PUT':
      try {
        const category = await Category.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!category) {
          return res.status(404).json({ success: false, error: 'Category not found' });
        }
        res.status(200).json(category);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    // Kategoriyi sil
    case 'DELETE':
      try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
          return res.status(404).json({ success: false, error: 'Category not found' });
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