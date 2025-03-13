import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  initialImageUrl?: string;
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ initialImageUrl = '', onImageUpload }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [useUrlInput, setUseUrlInput] = useState(!initialImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL manuel olarak değiştirildiğinde
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setImageUrl(newUrl);
    onImageUpload(newUrl);
  };

  // Dosya seçildiğinde
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya tipi kontrolü
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Lütfen geçerli bir resim dosyası seçin (JPEG, PNG, WEBP)');
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError('');

      // FormData oluştur
      const formData = new FormData();
      formData.append('image', file);

      // API'ye yükle
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Resim yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      
      // URL'yi güncelle ve parent component'e bildir
      setImageUrl(data.url);
      onImageUpload(data.url);
      
      // URL input moduna geç
      setUseUrlInput(false);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Resim yüklenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  // Dosya seçme dialog'unu aç
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => setUseUrlInput(true)}
          className={`px-3 py-1 rounded text-sm ${
            useUrlInput
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          URL Gir
        </button>
        <button
          type="button"
          onClick={() => setUseUrlInput(false)}
          className={`px-3 py-1 rounded text-sm ${
            !useUrlInput
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Resim Yükle
        </button>
      </div>

      {useUrlInput ? (
        <div>
          <input
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <p className="mt-1 text-sm text-gray-500">
            Görsel için doğrudan bir URL girin
          </p>
        </div>
      ) : (
        <div>
          <div
            onClick={handleSelectFile}
            className={`
              border-2 border-dashed rounded-md p-4 text-center cursor-pointer
              hover:bg-gray-50 transition-colors
              ${isUploading ? 'bg-gray-100 pointer-events-none' : ''}
              ${imageUrl ? 'border-green-300' : 'border-gray-300'}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Yükleniyor...</p>
              </div>
            ) : imageUrl ? (
              <div>
                <p className="text-sm text-gray-500 mb-2">Resmi değiştirmek için tıklayın</p>
                <div className="relative h-40 w-40 mx-auto">
                  <img
                    src={imageUrl}
                    alt="Yüklenen görsel"
                    className="h-full w-full object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150?text=Hata';
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="py-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-500">
                  Resim yüklemek için tıklayın veya dosyayı buraya sürükleyin
                </p>
                <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP (max 5MB)</p>
              </div>
            )}
          </div>

          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;