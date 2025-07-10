// src/pages/admin/products/index.tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import { Product, Category } from '../../../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Revalidate fonksiyonu - sayfaları yeniden oluşturmak için
  const triggerRevalidate = async () => {
    try {
      // Güçlü cache bypass kullan - Admin değişiklikleri için
      const response = await fetch('/api/revalidate?secret=villapark2024&bypass=true');
      const result = await response.json();
      console.log('Admin değişiklikleri anında uygulandı:', result);
    } catch (error) {
      console.error('Revalidate hatası:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      // Kategorileri getir
      const catResponse = await fetch('/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!catResponse.ok) {
        throw new Error('Kategoriler yüklenirken bir hata oluştu');
      }

      const categoriesData = await catResponse.json();
      setCategories(categoriesData);

      // Tüm ürünleri getir
      const productsResponse = await fetch('/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!productsResponse.ok) {
        throw new Error('Ürünler yüklenirken bir hata oluştu');
      }

      const productsData = await productsResponse.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Veri getirme hatası:', error);
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ürün silinirken bir hata oluştu');
      }

      // Başarıyla silindiyse listeyi güncelle
      fetchData();
      
      // Sayfaları yeniden oluştur
      await triggerRevalidate();
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      alert('Ürün silinirken bir hata oluştu');
    }
  };

  // Seçilen kategoriye göre ürünleri filtrele
  const filteredProducts = selectedCategory
    ? products.filter(product => {
        if (!product.categoryId) return false;
        
        // categoryId bir obje ise
        if (typeof product.categoryId === 'object') {
          return (product.categoryId._id || product.categoryId.id) === selectedCategory;
        }
        
        // String ise doğrudan karşılaştır
        return product.categoryId === selectedCategory;
      })
    : products;

  // Kategori adını bul
  const getCategoryName = (categoryId: string | { _id?: string; id?: string; name?: string }): string => {
    if (!categoryId) return 'Bilinmeyen Kategori';
    
    // Eğer categoryId bir nesne ise ve name özelliği varsa, doğrudan kullan
    if (typeof categoryId === 'object' && categoryId.name) {
      return categoryId.name;
    }
    
    // categoryId bir nesne ise, _id veya id özelliğini al
    const idToFind = typeof categoryId === 'object' 
      ? (categoryId._id || categoryId.id || '')
      : categoryId;
    
    const category = categories.find(cat => (cat._id || cat.id) === idToFind);
    return category ? category.name : 'Bilinmeyen Kategori';
  };

  const handleCategoryChange = async (id: string, categoryId: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryId })
      });

      if (!response.ok) {
        throw new Error('Ürün kategorisi güncellenirken bir hata oluştu');
      }

      // Başarıyla güncellendiyse listeyi güncelle
      fetchData();
      
      // Sayfaları yeniden oluştur
      await triggerRevalidate();
    } catch (error) {
      console.error('Ürün kategorisi güncelleme hatası:', error);
      alert('Ürün kategorisi güncellenirken bir hata oluştu');
    }
  };

  const handlePriceChange = async (id: string, price: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ price })
      });

      if (!response.ok) {
        throw new Error('Ürün fiyatı güncellenirken bir hata oluştu');
      }

      // Başarıyla güncellendiyse listeyi güncelle
      fetchData();
      
      // Sayfaları yeniden oluştur
      await triggerRevalidate();
    } catch (error) {
      console.error('Ürün fiyatı güncelleme hatası:', error);
      alert('Ürün fiyatı güncellenirken bir hata oluştu');
    }
  };

  return (
    <AdminLayout title="Ürünler">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600">Tüm ürünleri yönetin</p>
          <Link href="/admin/products/new">
            <span className="inline-flex whitespace-nowrap bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm">
              Yeni Ürün Ekle
            </span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Kategori Filtresi */}
        <div className="mb-6">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Kategoriye Göre Filtrele
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            <option value="">Tüm Ürünler</option>
            {categories.map((category) => (
              <option key={category._id || category.id} value={category._id || category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ürün Listesi */}
        <div className="bg-white rounded-lg shadow">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Görsel
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün Adı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id || product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.image ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            Yok
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description || 'Açıklama yok'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getCategoryName(product.categoryId || '')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{product.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/products/edit/${product._id || product.id}`}>
                        <span className="text-blue-600 hover:text-blue-900 mr-4">Düzenle</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id || product.id || '')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <div key={product._id || product.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 h-16 w-16">
                      {product.image ? (
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                          Yok
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {product.price} ₺
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {getCategoryName(product.categoryId || '')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedProduct(expandedProduct === (product._id || product.id || '') ? null : (product._id || product.id || ''))}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className={`h-5 w-5 transform transition-transform ${
                        expandedProduct === (product._id || product.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expandable Actions */}
                {expandedProduct === (product._id || product.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/edit/${product._id || product.id}`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id || product.id || '')}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}