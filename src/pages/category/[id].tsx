import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/product/ProductCard';
import { Category } from '../../types';
import menuData from '../../data/menu.json';
import Link from 'next/link';

interface CategoryPageProps {
  category: Category;
  categories: Category[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, categories }) => {
  const router = useRouter();

  // Sayfa henüz oluşturuluyorsa yükleniyor göster
  if (router.isFallback) {
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
        <title>{category.name} - VillaPark Cafe & Restaurant</title>
        <meta name="description" content={`VillaPark Cafe & Restaurant - ${category.name} kategorisindeki lezzetlerimiz`} />
      </Head>

      <div className="mb-8">
        <Link href="/">
          <span className="text-green-700 hover:text-green-900 flex items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Ana Sayfaya Dön
          </span>
        </Link>
      </div>

      <div className="relative py-8 mb-10 bg-green-50 rounded-lg shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" 
             style={{ backgroundImage: `url('${category.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1470&auto=format&fit=crop"}')` }}>
        </div>
        <div className="relative text-center px-4 py-4">
          <h1 className="text-3xl font-bold text-green-800 font-serif mb-2">{category.name}</h1>
          <p className="text-green-700">
            {category.products.length} lezzetli ürün sizleri bekliyor
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Diğer Kategoriler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories
            .filter((cat) => cat.id !== category.id)
            .map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`}>
                <div className="bg-white rounded-lg shadow-md p-3 text-center hover:bg-green-50 transition-colors cursor-pointer border border-green-100">
                  <p className="font-medium text-green-700">{cat.name}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Tüm kategori ID'lerini al
  const paths = menuData.categories.map((category) => ({
    params: { id: category.id },
  }));

  return {
    paths,
    fallback: false, // false: id geçersizse 404 sayfası göster
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // ID'ye göre kategoriyi bul
  const category = menuData.categories.find(
    (category) => category.id === params?.id
  );

  // Kategori bulunamazsa 404 sayfasına yönlendir
  if (!category) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      categories: menuData.categories,
    },
  };
};

export default CategoryPage; 