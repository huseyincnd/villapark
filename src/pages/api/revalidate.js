export default async function handler(req, res) {
  // Güvenlik kontrolü - secret parametresi gerekli
  if (req.query.secret !== process.env.REVALIDATE_SECRET && 
      req.query.secret !== 'villapark2024') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
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