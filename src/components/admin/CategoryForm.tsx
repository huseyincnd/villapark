// src/components/admin/CategoryForm.tsx
import React, { useState } from 'react';
import { Category } from '../../types';
import ImageUploader from './ImageUploader';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (formData: { name: string; image: string }) => Promise<void>;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [errors, setErrors] = useState({ name: '', image: '' });

  // Revalidate fonksiyonu - sayfaları yeniden oluşturmak için
  const triggerRevalidate = async () => {
    try {
      await fetch('/api/revalidate?secret=villapark2024');
      console.log('Sayfalar yeniden oluşturuldu');
    } catch (error) {
      console.error('Revalidate hatası:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basit doğrulama
    const newErrors = { name: '', image: '' };
    if (!name.trim()) {
      newErrors.name = 'Kategori adı gereklidir';
    }
    
    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      return;
    }
    
    // Form verilerini gönder
    await onSubmit({ name, image });
    
    // Değişiklik yapıldıktan sonra sayfaları yeniden oluştur
    await triggerRevalidate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Kategori Adı
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.name ? 'border-red-300' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Görsel
          </label>
          <div className="mt-1">
            <ImageUploader
              initialImageUrl={image}
              onImageUpload={(url) => setImage(url)}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Görsel için URL girebilir veya yeni bir görsel yükleyebilirsiniz
          </p>
        </div>

        {/* Görsel önizleme */}
        {image && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700">Görsel Önizleme:</p>
            <div className="mt-1 h-40 w-40 rounded-md overflow-hidden border border-gray-300">
              <img
                src={image}
                alt="Önizleme"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150?text=Hata';
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;