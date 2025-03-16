// src/pages/admin/products/edit/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import ProductForm from '../../../../components/admin/ProductForm';
import Link from 'next/link';
import { Product } from '../../../../types';

export default function EditProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // ID varsa ürünü getir
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Ürün bulunamadı');
      }
  
      const data = await response.json();
      
      // categoryId'nin doğru formatta olduğundan emin ol
      if (data.categoryId && typeof data.categoryId === 'object') {
        data.categoryId = data.categoryId._id || data.categoryId.id;
      }
      
      console.log("Fetched Product:", data); // Debug için
      setProduct(data);
    } catch (error) {
      console.error('Ürün getirme hatası:', error);
      setError('Ürün yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ürün güncellenirken bir hata oluştu');
      }

      // Başarılı olduğunda ürünler sayfasına yönlendir
      router.push('/admin/products');
    } catch (error) {
      console.error('Ürün güncelleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Ürün güncellenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Ürün Düzenle">
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

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : !product ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Ürün bulunamadı
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-8">
            <ProductForm
              initialData={product}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}