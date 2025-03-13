// src/pages/admin/dashboard.tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    categoryCount: 0,
    productCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        
        // Kategori sayısını getir
        const catResponse = await fetch('/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const categories = await catResponse.json();
        
        // Ürün sayısını hesapla
        let totalProducts = 0;
        if (Array.isArray(categories)) {
          // API'den gelen üst verilerde productCount varsa
          totalProducts = categories.reduce((total, cat) => total + (cat.productCount || 0), 0);
        }
        
        setStats({
          categoryCount: Array.isArray(categories) ? categories.length : 0,
          productCount: totalProducts
        });
      } catch (error) {
        console.error('İstatistik verisi getirme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-green-800">Kategoriler</h3>
              <p className="text-3xl font-bold text-green-900 mt-2">{stats.categoryCount}</p>
              <Link href="/admin/categories">
                <span className="text-green-700 hover:text-green-900 text-sm inline-block mt-3">
                  Kategorileri Yönet →
                </span>
              </Link>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-blue-800">Ürünler</h3>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.productCount}</p>
              <Link href="/admin/products">
                <span className="text-blue-700 hover:text-blue-900 text-sm inline-block mt-3">
                  Ürünleri Yönet →
                </span>
              </Link>
            </div>
          </div>

          {/* Hızlı işlemler */}
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/categories/new">
                <span className="bg-green-100 hover:bg-green-200 text-green-800 p-4 rounded-lg block text-center transition">
                  Yeni Kategori Ekle
                </span>
              </Link>
              <Link href="/admin/products/new">
                <span className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg block text-center transition">
                  Yeni Ürün Ekle
                </span>
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}