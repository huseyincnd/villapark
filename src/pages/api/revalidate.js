export default async function handler(req, res) {
  // Güvenlik kontrolü - secret parametresi gerekli
  if (req.query.secret !== process.env.REVALIDATE_SECRET && 
      req.query.secret !== 'villapark2024') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
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
        message: 'Admin değişiklikleri anında uygulandı!',
        results,
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