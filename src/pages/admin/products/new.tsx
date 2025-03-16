// src/pages/admin/products/new.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';
import Link from 'next/link';

export default function NewProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    price: string;
    image: string;
    categoryId: string;
    order: number;
  }) => {
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ürün eklenirken bir hata oluştu');
      }

      // Başarılı olduğunda ürünler sayfasına yönlendir
      router.push('/admin/products');
    } catch (error) {
      console.error('Ürün ekleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Ürün eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Yeni Ürün Ekle">
      <div className="mb-6">
        <Link href="/admin/products">
          <span className="text-green-600 hover:text-green-800">
            ← Ürünlere Dön
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
          <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </AdminLayout>
  );
}