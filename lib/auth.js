// lib/auth.js
import jwt from 'jsonwebtoken';

// JWT token'ı doğrulayan middleware
export function isAuthenticated(handler) {
  return async (req, res) => {
    try {
      // Authorization header'ı kontrol et
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false, 
          message: 'Yetkisiz erişim' 
        });
      }
      
      // Token'ı ayıkla
      const token = authHeader.replace('Bearer ', '');
      
      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Kullanıcı bilgisini request'e ekle
      req.user = decoded;
      
      // Sadece admin erişimine izin ver
      if (!decoded.isAdmin) {
        return res.status(403).json({ 
          success: false, 
          message: 'Yetkisiz erişim' 
        });
      }
      
      // İşlemi devam ettir
      return handler(req, res);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Oturum süresi doldu, lütfen tekrar giriş yapın' 
        });
      }
      
      return res.status(401).json({ 
        success: false, 
        message: 'Yetkisiz erişim' 
      });
    }
  };
}