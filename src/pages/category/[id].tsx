import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/product/ProductCard';
import { Category, Product } from '../../types';
import Link from 'next/link';

interface CategoryPageProps {
  initialCategory?: Category;
  initialCategories?: Category[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ initialCategory, initialCategories }) => {
  const router = useRouter();
  const { id } = router.query;
  
  const [category, setCategory] = useState<Category | null>(initialCategory || null);
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [loading, setLoading] = useState(!initialCategory);

  useEffect(() => {
    // Eğer id değişirse veya başlangıç verileri yoksa verileri yükle
    if (id && (!initialCategory || !initialCategories)) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Kategori bilgilerini getir
          const categoryRes = await fetch(`/api/categories/${id}`);
          
          if (!categoryRes.ok) {
            throw new Error('Kategori bulunamadı');
          }
          
          const categoryData = await categoryRes.json();
          setCategory(categoryData);
          
          // Tüm kategorileri getir (menü için)
          const categoriesRes = await fetch('/api/categories');
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
          
        } catch (error) {
          console.error('Veri yüklenirken hata oluştu:', error);
          router.push('/');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id, initialCategory, initialCategories, router]);

  // Sayfa yükleniyorsa yükleniyor göster
  if (loading || !category) {
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
        <title>
          {category ? `${category.name} - VillaPark Cafe & Restaurant` : 'VillaPark Cafe & Restaurant'}
        </title>
        <meta 
          name="description" 
          content={category 
            ? `VillaPark Cafe & Restaurant - ${category.name} kategorisindeki lezzetlerimiz`
            : 'VillaPark Cafe & Restaurant - Menümüz'
          } 
        />
      </Head>

      <div className="mb-8">
        <Link href="/">
          <span className="text-green-700 hover:text-green-900 flex items-center font-medium group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Ana Sayfaya Dön
          </span>
        </Link>
      </div>

      <div className="relative py-8 mb-10 bg-green-50 rounded-lg shadow-md overflow-hidden">
        {/* Dekoratif köşe süsleri */}
        <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
          <div className="absolute transform rotate-45 bg-green-500/10 w-16 h-16 -top-8 -left-8"></div>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute transform rotate-45 bg-green-500/10 w-16 h-16 -top-8 -right-8"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
          <div className="absolute transform rotate-45 bg-green-500/10 w-16 h-16 -bottom-8 -left-8"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute transform rotate-45 bg-green-500/10 w-16 h-16 -bottom-8 -right-8"></div>
        </div>
        
        <div className="absolute inset-0 bg-cover bg-center opacity-10" 
             style={{ backgroundImage: `url('${category.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1470&auto=format&fit=crop"}')` }}>
        </div>
        <div className="relative text-center px-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-green-600"></div>
            <div className="mx-4 h-8 w-8 rounded-full border-2 border-green-600 flex items-center justify-center">
              <div className="h-3 w-3 bg-green-600 rounded-full"></div>
            </div>
            <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-green-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-green-800 font-serif mb-2">
            {category.name}
          </h1>
          <p className="text-green-700">
            {category.products?.length || 0} lezzetli ürün sizleri bekliyor
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.products?.map((product) => (
          <ProductCard 
            key={product._id || product.id} 
            product={product} 
            categoryName={category.name} 
          />
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-green-800 mb-6 relative inline-block">
          Diğer Kategoriler
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-transparent"></span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories
            .filter((cat) => {
              // Şu anki kategoriyi filtrele
              const currentId = category._id?.toString() || category.id?.toString();
              const catId = cat._id?.toString() || cat.id?.toString();
              return currentId !== catId;
            })
            .map((cat) => (
              <Link key={cat._id || cat.id} href={`/category/${cat._id || cat.id}`}>
                <div className="bg-white rounded-lg shadow-md p-3 text-center hover:bg-green-50 transition-colors cursor-pointer border border-green-100 hover:border-green-300 transition-all">
                  <p className="font-medium text-green-700">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ params }: { params: { id: string } }) {
  try {
    // Absolute URL oluşturma
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL 
        ? process.env.NEXT_PUBLIC_SITE_URL
        : "http://localhost:3000";
    
    console.log("Using base URL:", baseUrl); // Debug için
    
    // Fetch işlemleri
    const categoryRes = await fetch(`${baseUrl}/api/categories/${params.id}`);
    // ... diğer kodlar
    
    if (!categoryRes.ok) {
      return { notFound: true };
    }
    
    const initialCategory = await categoryRes.json();
    
    const categoriesRes = await fetch(`${baseUrl}/api/categories`);
    const initialCategories = await categoriesRes.json();
    
    const productsRes = await fetch(`${baseUrl}/api/products?categoryId=${params.id}`);
    const products = await productsRes.json();
    
    initialCategory.products = products;
    
    return {
      props: {
        initialCategory,
        initialCategories,
      },
    };
  } catch (error) {
    console.error('Veri getirilemedi:', error);
    return { notFound: true };
  }
}

export default CategoryPage; 

