import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import CategoryCard from '../components/category/CategoryCard';
import { Category } from '../types';

interface HomeProps {
  initialCategories?: Category[];
}

const Home: React.FC<HomeProps> = ({ initialCategories }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [loading, setLoading] = useState(!initialCategories);

  useEffect(() => {
    // Sunucu tarafında veri gelmemişse veya client-side navigasyonu sonrası API'den kategorileri getir
    if (!initialCategories) {
      const fetchCategories = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/categories');
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error('Kategoriler yüklenirken hata oluştu:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
    }
  }, [initialCategories]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>VillaPark Cafe & Restaurant</title>
        <meta name="description" content="VillaPark Cafe & Restaurant - Lezzetin ve huzurun adresi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-8 mb-12 bg-green-50 rounded-lg shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1470&auto=format&fit=crop')" }}>
        </div>
        <div className="relative text-center px-4 py-6">
          <div className="flex items-center justify-center mb-4">
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-green-600"></div>
            <div className="mx-4 h-8 w-8 rounded-full border-2 border-green-600 flex items-center justify-center">
              <div className="h-3 w-3 bg-green-600 rounded-full"></div>
            </div>
            <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-green-600"></div>
          </div>
          <h1 className="text-4xl font-bold text-green-800 font-serif mb-2">
            VillaPark Menü
          </h1>
          <p className="text-green-700 text-lg max-w-2xl mx-auto">
            Taze malzemeler ve özenle hazırlanan lezzetlerimizle sizleri ağırlamaktan mutluluk duyuyoruz.
            Aşağıdaki kategorilerden dilediğinizi seçerek menümüzü keşfedebilirsiniz.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center relative">
        <span className="relative inline-block">
          Menü Kategorilerimiz
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-200 via-green-500 to-green-200"></span>
        </span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>

      <div className="mt-16 bg-green-50 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-green-800 mb-4 relative inline-block">
          VillaPark Cafe & Restaurant
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-transparent"></span>
        </h2>
        <p className="text-green-700 mb-3">
          VillaPark Cafe & Restaurant olarak, misafirlerimize en kaliteli hizmeti sunmak için buradayız. 
          Taze ve kaliteli malzemelerle hazırlanan lezzetlerimizi, huzurlu ortamımızda deneyimleyebilirsiniz.
        </p>
        <p className="text-green-700">
          Kahvaltıdan akşam yemeğine, tatlılardan içeceklere kadar geniş menümüzle sizleri ağırlamaktan mutluluk duyarız.
        </p>
    </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  try {
    // Node.js ortamında çalışacak şekilde fetch kullan
    const apiUrl = 'http://localhost:3000/api/categories';
    
    // Node.js tarafında çalışırken mutlak URL kullan
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const url = `${protocol}://${host}/api/categories`;
    
    const response = await fetch(url);
    const initialCategories = await response.json();

    return {
      props: {
        initialCategories,
      },
    };
  } catch (error) {
    console.error('Kategoriler getirilemedi:', error);
    return {
      props: {
        initialCategories: [],
      },
    };
  }
}

export default Home;
