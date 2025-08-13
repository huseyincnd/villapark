// src/pages/api/products/index.js
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Category from '../../../../models/Category';
import { isAuthenticated } from '../../../../lib/auth';

async function handler(req, res) {
  const { method } = req;
  const { categoryId, limit, skip } = req.query;

  try {
    // Veritabanı bağlantısını en başta yap
  await dbConnect();
    
    // Şemaların doğru şekilde yüklendiğinden emin ol
    console.log('Şemalar kontrol ediliyor...');
    console.log('Product şeması:', Product.schema ? 'Yüklü' : 'Yüklü değil');
    console.log('Category şeması:', Category.schema ? 'Yüklü' : 'Yüklü değil');

  switch (method) {
    // Tüm ürünleri getir
    case 'GET':
      try {
          console.log('API çağrısı alındı:', { categoryId, limit, skip });
          
          // Kategori ID'si geçerliliğini kontrol et
          if (categoryId) {
            const categoryExists = await Category.exists({ _id: categoryId });
            if (!categoryExists) {
              console.error(`Kategori bulunamadı: ${categoryId}`);
              return res.status(404).json({ success: false, error: 'Kategori bulunamadı' });
            }
          }
          
        const query = categoryId ? { categoryId } : {};
        
          // Önce veritabanı sorgusunu oluştur
          let productsQuery = Product.find(query);
          
          // Populate işlemini ekle
          productsQuery = productsQuery.populate('categoryId');
        
          // Önce sıralama işlemini MongoDB'de uygula
          // order ve _id'ye göre sıralama yaparak tutarlılık sağla
          productsQuery = productsQuery.sort({ order: 1, _id: 1 });
          
          // Pagination için offset (skip) uygula
          if (skip && !isNaN(parseInt(skip))) {
            const skipValue = parseInt(skip);
            console.log(`${skipValue} ürün atlanıyor`);
            productsQuery = productsQuery.skip(skipValue);
          }
          
          // Limit uygula
          if (limit && !isNaN(parseInt(limit))) {
            const limitValue = parseInt(limit);
            console.log(`Maksimum ${limitValue} ürün alınıyor`);
            productsQuery = productsQuery.limit(limitValue);
          }
          
          // Sorguyu çalıştır
          let products = await productsQuery;
          console.log(`${products.length} ürün bulundu`);
          
          // Admin değişikliklerinin anında gözükmesi için cache kaldırıldı
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(200).json(products);
      } catch (error) {
          console.error('Ürünler alınırken hata:', error);
          res.status(500).json({ success: false, error: error.message });
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
  } catch (dbError) {
    console.error('Veritabanı bağlantı hatası:', dbError);
    res.status(500).json({ success: false, error: 'Veritabanı bağlantı hatası' });
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