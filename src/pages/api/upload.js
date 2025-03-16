import { uploadImage } from '../../../lib/cloudinary';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import cloudinary from '../../../lib/cloudinary';

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
    try {
      // Cloudinary'ye buffer'ı yükle - multer.memoryStorage() kullandığımız için dosya diskde değil memory'de
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.cloudinary.uploader.upload(dataURI, {
        folder: 'qr-menu/products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
      });

      // Başarılı yanıt
      if (result.secure_url) {
        res.status(200).json({
          success: true,
          url: result.secure_url
        });
      } else {
        // Cloudinary başarı döndürdü ama URL yok
        console.error('Cloudinary URL missing:', result);
        res.status(400).json({
          success: false,
          error: 'Resim URL\'i alınamadı'
        });
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      // Hata yanıtı
      res.status(500).json({
        success: false,
        error: error.message || 'Resim yüklenirken bir hata oluştu'
      });
    }
    // Geçici dosya cleanup kaldırıldı çünkü memory storage kullanıyoruz

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Resim yüklenirken bir hata oluştu' });
  }
}