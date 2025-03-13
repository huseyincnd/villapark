// src/pages/admin/categories/index.tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import { Category, Product } from '../../../types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
      setError('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ürünler yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Kategori silinirken bir hata oluştu');
      }

      // Başarıyla silindiyse listeyi güncelle
      fetchCategories();
    } catch (error) {
      console.error('Kategori silme hatası:', error);
      alert('Kategori silinirken bir hata oluştu');
    }
  };

  const handleDescriptionChange = async (id: string, description: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/categories/${id}/description`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
      });

      if (!response.ok) {
        throw new Error('Kategori açıklaması güncellenirken bir hata oluştu');
      }

      // Başarıyla güncellendiyse listeyi güncelle
      fetchCategories();
    } catch (error) {
      console.error('Kategori açıklaması güncelleme hatası:', error);
      alert('Kategori açıklaması güncellenirken bir hata oluştu');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Kategori güncellenirken bir hata oluştu');
      }

      // Başarıyla güncellendiyse listeyi güncelle
      fetchCategories();
    } catch (error) {
      console.error('Kategori güncelleme hatası:', error);
      alert('Kategori güncellenirken bir hata oluştu');
    }
  };

  return (
    <AdminLayout title="Kategoriler">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600">Tüm kategorileri yönetin</p>
          <Link href="/admin/categories/new">
            <span className="inline-flex whitespace-nowrap bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm">
              Yeni Kategori Ekle
            </span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-gray-500">Henüz hiç kategori eklenmemiş</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Görsel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori Adı
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ürün Sayısı
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id || category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-10 w-10">
                          {category.image ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={category.image}
                              alt={category.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              Yok
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{category.productCount || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/categories/edit/${category._id || category.id}`}>
                          <span className="text-blue-600 hover:text-blue-900 mr-4">Düzenle</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(category._id || category.id || '')}
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

            <div className="md:hidden divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category._id || category.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 h-16 w-16">
                        {category.image ? (
                          <img
                            className="h-16 w-16 rounded-lg object-cover"
                            src={category.image}
                            alt={category.name}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                            Yok
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description || 'Açıklama yok'}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {products.filter(p => {
                              const pCategoryId = typeof p.categoryId === 'object' 
                                ? (p.categoryId._id || p.categoryId.id)
                                : p.categoryId;
                              return pCategoryId === (category._id || category.id);
                            }).length} ürün
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === (category._id || category.id) ? null : (category._id || category.id || '') as string)}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <svg
                        className={`h-5 w-5 transform transition-transform ${
                          expandedCategory === (category._id || category.id) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {expandedCategory === (category._id || category.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/categories/edit/${category._id || category.id}`}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => handleDelete(category._id || category.id || '')}
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
        )}
      </div>
    </AdminLayout>
  );
}