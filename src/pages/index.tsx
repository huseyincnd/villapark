import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import CategoryCard from '../components/category/CategoryCard';
import { Category } from '../types';
import menuData from '../data/menu.json';

interface HomeProps {
  categories: Category[];
}

const Home: React.FC<HomeProps> = ({ categories }) => {
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
          <h1 className="text-4xl font-bold text-green-800 font-serif mb-2">VillaPark Menü</h1>
          <p className="text-green-700 text-lg max-w-2xl mx-auto">
            Taze malzemeler ve özenle hazırlanan lezzetlerimizle sizleri ağırlamaktan mutluluk duyuyoruz.
            Aşağıdaki kategorilerden dilediğinizi seçerek menümüzü keşfedebilirsiniz.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Menü Kategorilerimiz</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      <div className="mt-16 bg-green-50 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-green-800 mb-4">VillaPark Cafe & Restaurant</h2>
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

export const getStaticProps: GetStaticProps = async () => {
  // JSON dosyasından kategorileri al
  const categories = menuData.categories;

  return {
    props: {
      categories,
    },
  };
};

export default Home;
