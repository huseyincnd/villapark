// src/pages/admin/categories/new.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import CategoryForm from '../../../components/admin/CategoryForm';
import Link from 'next/link';

export default function NewCategory() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (formData: { name: string; image: string }) => {
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kategori eklenirken bir hata oluştu');
      }

      // Başarılı olduğunda kategoriler sayfasına yönlendir
      router.push('/admin/categories');
    } catch (error) {
      console.error('Kategori ekleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Kategori eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Yeni Kategori Ekle">
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

      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-8">
          <CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </AdminLayout>
  );
}