import { uploadImage } from '../../../lib/cloudinary';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

// Multer konfigürasyonu (belleğe upload için)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Multer middleware'ini Promise'e çevir
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve(undefined);
    });
  });
}

export const config = {
  api: {
    bodyParser: false, // Multer kullandığımız için built-in parser'ı kapatıyoruz
  },
};

export default async function handler(req, res) {
  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Token doğrulama
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token bulunamadı' });
    }

    try {
      // JWT token doğrulama
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({ error: 'Geçersiz token' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Geçersiz token' });
    }

    // Multer middleware'ini çalıştır
    await runMiddleware(req, res, upload.single('image'));

    // Dosya kontrolü
    if (!req.file) {
      return res.status(400).json({ error: 'Lütfen bir resim dosyası yükleyin' });
    }

    // Cloudinary'ye yükle
    const uploadResult = await uploadImage(req.file);

    if (!uploadResult.success) {
      return res.status(500).json({ error: uploadResult.error });
    }

    // Başarılı yanıt
    return res.status(200).json({ 
      url: uploadResult.url, 
      public_id: uploadResult.public_id 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Resim yüklenirken bir hata oluştu' });
  }
}