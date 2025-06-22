export default async function handler(req, res) {
  // Güvenlik kontrolü - secret parametresi gerekli
  if (req.query.secret !== process.env.REVALIDATE_SECRET && 
      req.query.secret !== 'villapark2024') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Cache bypass parametresi - Tüm cache'leri atla
    if (req.query.bypass === 'true') {
      // Timestamp ile cache'i bypass et
      const timestamp = Date.now();
      const baseUrl = "https://villapark.vercel.app";
      
      // Tüm API endpoint'lerini timestamp ile çağır (cache bypass)
      const apiEndpoints = [
        `/api/categories?t=${timestamp}`,
        `/api/products?categoryId=67d21b747ee76f02a06f389b&t=${timestamp}`,
        `/api/products?categoryId=67d21b747ee76f02a06f38a9&t=${timestamp}`, 
        `/api/products?categoryId=67d21b757ee76f02a06f38b7&t=${timestamp}`,
        `/api/products?categoryId=67d21b737ee76f02a06f3881&t=${timestamp}`,
        `/api/products?categoryId=67d21b747ee76f02a06f38b5&t=${timestamp}`
      ];
      
      // API'leri çağırarak cache'i yenile
      const cacheBypassResults = [];
      for (const apiPath of apiEndpoints) {
        try {
          const response = await fetch(`${baseUrl}${apiPath}`);
          cacheBypassResults.push({ 
            path: apiPath, 
            success: response.ok,
            status: response.status 
          });
        } catch (error) {
          cacheBypassResults.push({ 
            path: apiPath, 
            success: false, 
            error: error.message 
          });
        }
      }
      
      // Sayfaları revalidate et
      const pagesToRevalidate = [
        '/',
        '/category/67d21b747ee76f02a06f389b',
        '/category/67d21b747ee76f02a06f38a9',
        '/category/67d21b757ee76f02a06f38b7',
        '/category/67d21b737ee76f02a06f3881',
        '/category/67d21b747ee76f02a06f38b5',
      ];
      
      const revalidateResults = await Promise.all(
        pagesToRevalidate.map(async (path) => {
          try {
            await res.revalidate(path);
            return { path, success: true, timestamp: new Date().toISOString() };
          } catch (error) {
            return { path, success: false, error: error.message };
          }
        })
      );
      
      return res.json({
        bypassed: true,
        message: 'Cache bypass edildi ve site anında güncellendi!',
        timestamp,
        cacheBypassResults,
        revalidateResults,
        note: 'Bu yöntem cache\'i tamamen atlar ve anında yeniler'
      });
    }

    // Admin değişikliği sonrası anında yenileme (immediate parametresi)
    if (req.query.immediate === 'true') {
      const pagesToRevalidateImmediately = [
        '/',                                    // Ana sayfa
        '/category/67d21b747ee76f02a06f389b',   // Soğuk İçecekler
        '/category/67d21b747ee76f02a06f38a9',   // Sıcak İçecekler
        '/category/67d21b757ee76f02a06f38b7',   // Tatlı ve Pasta
        '/category/67d21b737ee76f02a06f3881',   // Kahvaltılar
        '/category/67d21b747ee76f02a06f38b5',   // Nargile
      ];
      
      // Önce API cache'lerini temizle
      const apiEndpoints = [
        '/api/categories',
        '/api/products?categoryId=67d21b747ee76f02a06f389b',
        '/api/products?categoryId=67d21b747ee76f02a06f38a9', 
        '/api/products?categoryId=67d21b757ee76f02a06f38b7',
        '/api/products?categoryId=67d21b737ee76f02a06f3881',
        '/api/products?categoryId=67d21b747ee76f02a06f38b5'
      ];
      
      // Vercel Cache Purge API'sini kullan
      const purgeResults = [];
      for (const apiPath of apiEndpoints) {
        try {
          const purgeResponse = await fetch(`https://api.vercel.com/v1/purge?url=https://villapark.vercel.app${apiPath}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.VERCEL_TOKEN || 'fallback'}`,
              'Content-Type': 'application/json'
            }
          });
          
          purgeResults.push({ 
            path: apiPath, 
            purged: purgeResponse.ok,
            status: purgeResponse.status 
          });
        } catch (error) {
          purgeResults.push({ 
            path: apiPath, 
            purged: false, 
            error: error.message 
          });
        }
      }
      
      // Sonra sayfaları revalidate et
      const results = await Promise.all(
        pagesToRevalidateImmediately.map(async (path) => {
          try {
            await res.revalidate(path);
            return { path, success: true, timestamp: new Date().toISOString() };
          } catch (error) {
            return { path, success: false, error: error.message };
          }
        })
      );
      
      return res.json({
        revalidated: true,
        immediate: true,
        message: 'Cache temizlendi ve sayfalar anında güncellendi!',
        purgeResults,
        revalidateResults: results,
        totalPages: pagesToRevalidateImmediately.length
      });
    }

    // Belirli kategori değişikliği (categoryId parametresi)
    if (req.query.categoryId) {
      const categoryPath = `/category/${req.query.categoryId}`;
      await res.revalidate('/'); // Ana sayfa
      await res.revalidate(categoryPath); // İlgili kategori
      
      return res.json({
        revalidated: true,
        category: req.query.categoryId,
        message: 'Kategori anında güncellendi!',
        revalidatedPaths: ['/', categoryPath]
      });
    }

    // Belirli bir sayfayı yeniden oluştur (path parametresi verilmişse)
    if (req.query.path) {
      await res.revalidate(req.query.path);
      return res.json({
        revalidated: true,
        path: req.query.path
      });
    }
    
    // Bilinen sayfaları yeniden oluştur
    const pagesToRevalidate = [
      '/',
      '/category/67d21b747ee76f02a06f389b', // Soğuk İçecekler
      '/category/67d21b747ee76f02a06f38a9', // Sıcak İçecekler
      '/category/67d21b757ee76f02a06f38b7', // Tatlı ve Pasta
      '/category/67d21b737ee76f02a06f3881', // Kahvaltılar
      '/category/67d21b747ee76f02a06f38b5', // Nargile
      '/admin',                     // Admin ana sayfası
      '/admin/products',            // Ürünler sayfası
      '/admin/categories',          // Kategoriler sayfası
      // Diğer kategoriler...
    ];
    
    // Tüm sayfaları yeniden oluştur
    const results = await Promise.all(
      pagesToRevalidate.map(async (path) => {
        try {
          await res.revalidate(path);
          return { path, success: true };
        } catch (error) {
          return { path, success: false, error: error.message };
        }
      })
    );
    
    return res.json({
      revalidated: true,
      results
    });
  } catch (err) {
    // Hata durumunda
    return res.status(500).json({
      revalidated: false,
      error: err.message
    });
  }
} 