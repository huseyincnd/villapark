// src/components/admin/AdminLayout.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Admin girişi kontrolü
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin');
        return;
      }

      try {
        const response = await fetch('/api/admin/test', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          localStorage.removeItem('admin_token');
          router.push('/admin');
        }
      } catch (error) {
        console.error('Yetkilendirme hatası:', error);
        localStorage.removeItem('admin_token');
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${title} - VillaPark Admin`}</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-green-700 text-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">VillaPark Admin</h1>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
            >
              Çıkış Yap
            </button>
          </div>
        </header>

        {/* Sidebar ve içerik */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-white shadow rounded-lg p-4">
            <nav className="space-y-2">
              <Link href="/admin/dashboard">
                <span className={`block px-4 py-2 rounded hover:bg-green-50 hover:text-green-700 ${router.pathname === '/admin/dashboard' ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-600'}`}>
                  Dashboard
                </span>
              </Link>
              <Link href="/admin/categories">
                <span className={`block px-4 py-2 rounded hover:bg-green-50 hover:text-green-700 ${router.pathname.startsWith('/admin/categories') ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-600'}`}>
                  Kategoriler
                </span>
              </Link>
              <Link href="/admin/products">
                <span className={`block px-4 py-2 rounded hover:bg-green-50 hover:text-green-700 ${router.pathname.startsWith('/admin/products') ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-600'}`}>
                  Ürünler
                </span>
              </Link>
              <Link href="/">
                <span className="block px-4 py-2 rounded hover:bg-green-50 hover:text-green-700 text-gray-600">
                  Siteyi Görüntüle
                </span>
              </Link>
            </nav>
          </aside>

          {/* Ana içerik */}
          <main className="flex-1 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;