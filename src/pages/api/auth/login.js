// src/pages/api/auth/login.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  // Sadece POST isteklerini kabul et
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { username, password } = req.body;

    // .env.local'dan admin bilgilerini kontrol et
    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;

    // Kullanıcı adı ve şifre kontrolü
    if (username === correctUsername && password === correctPassword) {
      // JWT token oluştur
      const token = jwt.sign(
        { username, isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // 7 gün geçerli
      );

      // Token'ı gönder
      return res.status(200).json({ 
        success: true, 
        token,
        message: 'Giriş başarılı' 
      });
    }

    // Hatalı kullanıcı adı veya şifre
    return res.status(401).json({ 
      success: false, 
      message: 'Kullanıcı adı veya şifre hatalı' 
    });
  } catch (error) {
    console.error('Login hatası:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}