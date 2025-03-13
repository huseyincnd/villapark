// src/pages/admin/categories/edit/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import CategoryForm from '../../../../components/admin/CategoryForm';
import Link from 'next/link';
import { Category } from '../../../../types';

export default function EditCategory() {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // ID varsa kategoriyi getir
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Kategori bulunamadı');
      }

      const data = await response.json();
      setCategory(data);
    } catch (error) {
      console.error('Kategori getirme hatası:', error);
      setError('Kategori yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: { name: string; image: string }) => {
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kategori güncellenirken bir hata oluştu');
      }

      // Başarılı olduğunda kategoriler sayfasına yönlendir
      router.push('/admin/categories');
    } catch (error) {
      console.error('Kategori güncelleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Kategori güncellenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Kategori Düzenle">
      <div className="mb-6">
        <Link href="/admin/categories">
          <span className="text-green-600 hover:text-green-800">
            ← Kategorilere Dön
          </span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : !category ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Kategori bulunamadı
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-8">
            <CategoryForm
              initialData={category}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}