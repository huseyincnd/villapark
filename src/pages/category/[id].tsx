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
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Soğuk İçecekler kategorisi için ID kontrolü
  const isColdDrinks = category?._id?.toString() === '67d21b747ee76f02a06f389b' || 
                     category?.id?.toString() === '67d21b747ee76f02a06f389b';

  // Eğer sayfa fallback ise (yani henüz oluşturulmadıysa) yükleniyor göster
  if (router.isFallback) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
          <p className="text-green-600 font-medium">Kategori yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    // Kategori ID değiştiğinde veya sayfa ilk yüklendiğinde verileri çek
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Kategori bilgilerini getir
        const categoryRes = await fetch(`/api/categories/${id}`);
        
        if (!categoryRes.ok) {
          throw new Error('Kategori bulunamadı');
        }
        
        const categoryData = await categoryRes.json();
        
        // Kategori ürünlerini getir (Soğuk içecekler için ilk 20 ürün)
        const isColdDrinksCheck = categoryData._id?.toString() === '67d21b747ee76f02a06f389b' || 
                                categoryData.id?.toString() === '67d21b747ee76f02a06f389b';
        
        let productsUrl = `/api/products?categoryId=${id}`;
        if (isColdDrinksCheck) {
          productsUrl += '&limit=20';
        }
        
        const productsRes = await fetch(productsUrl);
        const productsData = await productsRes.json();
        
        // Ürünleri kategoriye ekle
        categoryData.products = productsData;
        categoryData.isColdDrinks = isColdDrinksCheck;
        setCategory(categoryData);
        setHasMore(isColdDrinksCheck && productsData.length >= 20);
        
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

    if (id) {
      fetchData();
      setCurrentPage(1);
    }
  }, [id, router]);

  // Daha fazla ürün yükleme fonksiyonu (Soğuk İçecekler için)
  const loadMoreProducts = async () => {
    if (!isColdDrinks || loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      
      // Şu anki ürün sayısını alın ve bu değeri skip olarak kullanın
      const currentProductCount = category?.products?.length || 0;
      
      console.log(`Daha fazla ürün yükleniyor: mevcut=${currentProductCount}`);
      
      // Hata ayıklama için API URL'ini konsola yazdır
      const apiUrl = `/api/products?categoryId=${id}&limit=20&skip=${currentProductCount}`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
      }
      
      const newProducts = await response.json();
      console.log(`${newProducts.length} yeni ürün yüklendi`);
      
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setCategory(prev => {
          if (!prev) return prev;
          
          // Mevcut ürünler yoksa boş bir dizi kullan
          const currentProducts = prev.products || [];
          
          return {
            ...prev,
            products: [...currentProducts, ...newProducts]
          };
        });
        
        setCurrentPage(prev => prev + 1);
        setHasMore(newProducts.length >= 20);
      }
    } catch (error) {
      console.error('Daha fazla ürün yüklenirken hata oluştu:', error);
      setHasMore(false); // Hata durumunda daha fazla yükleme yapma
    } finally {
      setLoadingMore(false);
    }
  };

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

      {/* Soğuk İçecekler için "Daha Fazla Yükle" butonu */}
      {isColdDrinks && hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreProducts}
            disabled={loadingMore}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center"
          >
            {loadingMore ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yükleniyor...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Daha Fazla Göster
              </>
            )}
          </button>
        </div>
      )}

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
              <Link 
                key={cat._id || cat.id} 
                href={`/category/${cat._id || cat.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  router.push(`/category/${cat._id || cat.id}`);
                }}
              >
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

export async function getStaticPaths() {
  try {
    // Hem production URL hem de fallback URL'i deneyelim
    const baseUrls = [
      "https://villapark.vercel.app",
      "http://localhost:3000"
    ];
    
    let categories = [];
    let success = false;
    
    // Her URL'i deneyelim
    for (const baseUrl of baseUrls) {
      try {
        console.log(`Kategoriler için ${baseUrl} deneniyor...`);
        const categoriesRes = await fetch(`${baseUrl}/api/categories`);
        if (categoriesRes.ok) {
          categories = await categoriesRes.json();
          success = true;
          console.log(`Kategoriler ${baseUrl}'den başarıyla alındı.`);
          break;
        }
      } catch (e) {
        console.error(`${baseUrl}'den kategoriler alınamadı:`, e);
      }
    }
    
    // Eğer API'lerden hiçbiri çalışmazsa, boş paths döndür ama fallback true olsun
    if (!success || !categories || categories.length === 0) {
      console.log('API çağrıları başarısız oldu, fallback: true ile devam ediliyor');
      return { paths: [], fallback: true };
    }
    
    // Doğrudan soğuk içecekler ID'sini ekleyelim
    const knownCategoryIds = [
      '67d21b747ee76f02a06f389b', // Soğuk İçecekler
      '67d21b747ee76f02a06f38a9', // Sıcak İçecekler  
      '67d21b757ee76f02a06f38b7', // Tatlı ve Pasta
      // Diğer bilinen kategori ID'lerini buraya ekleyebilirsiniz
    ];
    
    // API'den gelen kategorilerden paths oluştur
    const pathsFromAPI = categories.map((category: any) => ({
      params: { id: category._id.toString() }
    }));
    
    // Bilinen ID'lerden paths oluştur
    const pathsFromKnownIds = knownCategoryIds.map(id => ({
      params: { id }
    }));
    
    // Tüm paths'leri birleştir ve tekrarları kaldır
    const allPaths = [...pathsFromAPI, ...pathsFromKnownIds];
    const uniquePaths = Array.from(new Set(allPaths.map(path => path.params.id)))
      .map(id => ({ params: { id: id.toString() } }));
    
    console.log(`Toplam ${uniquePaths.length} kategori sayfası için paths oluşturuldu`);
    
    return {
      paths: uniquePaths,
      fallback: true 
    };
  } catch (error) {
    console.error('Paths oluşturulamadı:', error);
    return {
      paths: [],
      fallback: true
    };
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    // Hardcoded URL kullanın
    const baseUrl = "https://villapark.vercel.app";
    
    // Kategori bilgilerini getir
    const categoryRes = await fetch(`${baseUrl}/api/categories/${params.id}`);
    
    if (!categoryRes.ok) {
      console.error(`Kategori API hatası: ${categoryRes.status}`);
      return { 
        notFound: true,
        revalidate: 86400 // 24 saat
      };
    }
    
    const initialCategory = await categoryRes.json();
    
    // Tüm kategorileri getir
    const categoriesRes = await fetch(`${baseUrl}/api/categories`);
    if (!categoriesRes.ok) {
      console.error(`Kategoriler API hatası: ${categoriesRes.status}`);
      throw new Error("Kategoriler alınamadı");
    }
    
    const initialCategories = await categoriesRes.json();
    
    // Soğuk içecekler kategorisi için özel işlem (id'yi kontrol et)
    const isColdDrinks = params.id === '67d21b747ee76f02a06f389b';
    
    let products = [];
    if (isColdDrinks) {
      // Soğuk içecekler için sadece ilk 20 ürünü al
      const productsRes = await fetch(`${baseUrl}/api/products?categoryId=${params.id}&limit=20`);
      if (productsRes.ok) {
        products = await productsRes.json();
        console.log("Soğuk içecekler kategorisi için ilk 20 ürün yüklendi");
      } else {
        console.error(`Ürünler API hatası: ${productsRes.status}`);
      }
    } else {
      // Diğer kategoriler için normal işlem
      const productsRes = await fetch(`${baseUrl}/api/products?categoryId=${params.id}`);
      if (!productsRes.ok) {
        console.error(`Ürünler API hatası: ${productsRes.status}`);
        throw new Error("Ürünler alınamadı");
      }
      products = await productsRes.json();
    }
    
    // Ürünleri kategoriye ekle
    initialCategory.products = products;
    initialCategory.isColdDrinks = isColdDrinks;
    
    return {
      props: {
        initialCategory,
        initialCategories,
      },
      revalidate: 86400 // 24 saat 
    };
  } catch (error) {
    console.error('Veri getirilemedi:', error);
    return {
      notFound: true,
      revalidate: 86400 // 24 saat
    };
  }
}

export default CategoryPage; 