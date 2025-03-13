// Cloudinary konfigürasyon dosyası
const cloudinary = require('cloudinary').v2;

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Resim yükleme fonksiyonu
const uploadImage = async (imageFile) => {
  try {
    const result = await new Promise((resolve, reject) => {
      // Yükleme stream'i oluştur
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'qr-menu', // Cloudinary'deki klasör adı
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'heic'], // iPhone HEIC formatını da ekledik
          transformation: [
            { width: 1600, height: 1600, crop: 'limit' }, // Daha yüksek çözünürlük limiti
            { quality: 'auto:good' }, // iyi kalite optimizasyonu
            { fetch_format: 'auto' }, // Otomatik format optimizasyonu
            { strip: true } // Metadata temizleme
          ],
          responsive_breakpoints: {
            create_derived: true,
            bytes_step: 20000,
            min_width: 200,
            max_width: 1600,
            transformation: { crop: 'limit', quality: 'auto:good' }
          },
          resource_type: 'auto',
          use_filename: true, // Orijinal dosya adını koru
          unique_filename: true, // Benzersiz isim oluştur
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Buffer'ı stream'e yönlendir
      uploadStream.end(imageFile.buffer);
    });

    // Yükleme başarılı olduğunda URL döndür
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      // Ek bilgiler
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Resim yükleme hatası:', error);
    return {
      success: false,
      error: 'Resim yüklenirken bir hata oluştu'
    };
  }
};

module.exports = {
  cloudinary,
  uploadImage
};