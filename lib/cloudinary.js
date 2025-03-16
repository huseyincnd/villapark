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
const uploadImage = async (imagePath, options = {}) => {
  try {
    // Varsayılan ayarlar
    const defaultOptions = {
      folder: 'qr-menu',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    };

    // Kullanıcı ayarlarını varsayılan ayarlarla birleştir
    const cloudinaryOptions = { ...defaultOptions, ...options };

    // Görsel yükleme
    const result = await cloudinary.uploader.upload(imagePath, cloudinaryOptions);

    // Başarılı yanıt
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Detaylı hata yanıtı
    return {
      success: false,
      error: error.message || 'Görsel yüklenirken bir hata oluştu',
      details: error.toString() // Include error details for debugging
    };
  }
};

module.exports = {
  cloudinary,
  uploadImage
};