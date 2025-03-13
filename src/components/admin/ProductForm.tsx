// src/components/admin/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import ImageUploader from './ImageUploader';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (formData: {
    name: string;
    description: string;
    price: string;
    image: string;
    categoryId: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [image, setImage] = useState(initialData?.image || '');
  
  // Burada categoryId'yi daha güvenli bir şekilde ayarlıyoruz
  const [categoryId, setCategoryId] = useState('');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    categoryId: ''
  });
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  // initialData değiştiğinde categoryId'yi güncelle
  useEffect(() => {
    if (initialData && initialData.categoryId) {
      // String olarak categoryId'yi set et
      const catId = typeof initialData.categoryId === 'object' && initialData.categoryId !== null
        ? (initialData.categoryId._id || initialData.categoryId.id || '')
        : String(initialData.categoryId);
      
      setCategoryId(catId);
    }
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Kategoriler yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setCategories(data);

      // Eğer kategori seçilmemişse ve kategoriler varsa ve yeni bir ürün ekliyorsa, ilk kategoriyi seç
      if (!categoryId && data.length > 0 && !initialData) {
        setCategoryId(data[0]._id || data[0].id || '');
      }
      
      // Düzenleme modunda ve categoryId varsa, seçili kategoriyi kontrol et
      if (initialData && initialData.categoryId && data.length > 0) {
        const catId = typeof initialData.categoryId === 'object' && initialData.categoryId !== null
          ? (initialData.categoryId._id || initialData.categoryId.id || '')
          : String(initialData.categoryId);
          
        // Kategori listesinde bu ID var mı kontrol et
        const categoryExists = data.some((cat: Category) => 
          (cat._id || cat.id) === catId
        );
        
        if (categoryExists) {
          setCategoryId(catId);
        } else if (data.length > 0) {
          // Eğer kategorid ID'si bulunamadıysa, ilk kategoriyi seç
          setCategoryId(data[0]._id || data[0].id || '');
        }
      }
    } catch (error) {
      console.error('Kategorileri getirme hatası:', error);
      setCategoryError('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basit doğrulama
    const newErrors = { name: '', price: '', categoryId: '' };
    if (!name.trim()) {
      newErrors.name = 'Ürün adı gereklidir';
    }
    if (!price.trim()) {
      newErrors.price = 'Fiyat gereklidir';
    }
    if (!categoryId) {
      newErrors.categoryId = 'Kategori seçilmelidir';
    }
    
    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      return;
    }
    
    // Form verilerini gönder
    await onSubmit({ name, description, price, image, categoryId });
  };

  // Debug bilgisi ekle (geliştirme aşamasında yardımcı olabilir)
  console.log("Initial CategoryId:", initialData?.categoryId);
  console.log("Current CategoryId:", categoryId);
  console.log("Available Categories:", categories);

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Ürün Adı
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Açıklama
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Fiyat
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.price ? 'border-red-300' : ''
              }`}
              disabled={isSubmitting}
              placeholder="Örn: 120 TL"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
        </div>

        <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Kategori
        </label>
        <div className="mt-1">
          {isLoadingCategories ? (
            <div className="animate-pulse h-10 bg-gray-100 rounded"></div>
          ) : categoryError ? (
            <div className="text-red-600 text-sm">{categoryError}</div>
          ) : categories.length === 0 ? (
            <div className="text-amber-600 text-sm">
              Henüz hiç kategori yok.{' '}
              <a href="/admin/categories/new" className="text-green-600 underline">
                Önce bir kategori ekleyin.
              </a>
            </div>
          ) : (
            <select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.categoryId ? 'border-red-300' : ''
              }`}
              disabled={isSubmitting || categories.length === 0}
            >
              <option value="">Kategori Seçin</option>
              {categories.map((category) => (
                <option key={category._id || category.id} value={category._id || category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
          
          {/* Debug gösterimi (geliştirme aşamasında yardımcı olabilir) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-xs text-gray-500">
              <div>Seçili Kategori ID: {categoryId || 'Yok'}</div>
              <div>İlk Kategori ID: {categories[0] ? (categories[0]._id || categories[0].id) : 'Yok'}</div>
            </div>
          )}
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

export default ProductForm;