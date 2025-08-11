import React, { useState, useEffect, useRef } from 'react';
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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  
  const menuSectionRef = useRef<HTMLDivElement>(null);

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
          console.error('Kategoriler yüklenirken hata oluştu:.', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
    }
  }, [initialCategories]);

  const scrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

      {/* Drone Video Section */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-xl mb-12 bg-gradient-to-br from-green-700 to-green-900">
        {/* Video Placeholder (shown until video loads) */}
        {!videoLoaded && (
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-green-50 to-green-100 flex justify-center items-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="mt-3 text-green-700 font-medium">Video Yükleniyor...</p>
            </div>
          </div>
        )}
        
        {/* Video container with decorative elements */}
        <div className="flex justify-center">
          {/* Left decorative pattern */}
          <div className="hidden lg:block w-1/6 bg-gradient-to-br from-green-700 to-green-900 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute rounded-full bg-green-300" 
                    style={{
                      width: `${Math.random() * 20 + 5}px`,
                      height: `${Math.random() * 20 + 5}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.1
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Drone Video */}
          <div className="w-full lg:w-2/3" style={{ height: "70vh", maxHeight: "600px", overflow: "hidden" }}>
            <div className="w-full h-full relative overflow-hidden transform scale-110">
              <iframe 
                src="https://iframe.mediadelivery.net/embed/405685/9c33e4aa-44b1-45d3-adbe-42fe02c7fa7c?autoplay=true&loop=true&muted=true&preload=true" 
                loading="lazy"
                className="absolute inset-0 w-full h-full"
                style={{ 
                  border: "none",
                  objectFit: "cover", 
                  transform: "scale(1.1)" 
                }}
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                allowFullScreen={true}
                onLoad={() => setVideoLoaded(true)}
              />
            </div>
          </div>
          
          {/* Right decorative pattern */}
          <div className="hidden lg:block w-1/6 bg-gradient-to-bl from-green-700 to-green-900 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute rounded-full bg-green-300" 
                    style={{
                      width: `${Math.random() * 20 + 5}px`,
                      height: `${Math.random() * 20 + 5}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.1
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-transparent to-transparent opacity-80 pointer-events-none"></div>
        
        {/* Video Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center sm:text-left">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 font-serif drop-shadow-lg">
              VillaPark Cafe & Restaurant
            </h1>
            <p className="text-xl sm:text-2xl mb-4 drop-shadow-md max-w-2xl">
              Lezzetin ve huzurun buluştuğu nokta
            </p>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <button 
                onClick={scrollToMenu}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Menüyü İncele
              </button>
              <button 
                onClick={() => setShowContactModal(true)}
                className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                İletişim & Konum
              </button>
            </div>
          </div>
        </div>
      </div>

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

      <div ref={menuSectionRef}>
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

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300">
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-green-600 p-4 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">İletişim & Konum</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-white hover:text-green-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="bg-green-100 rounded-full p-2 mr-4 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-700 font-semibold text-lg">Telefon</h4>
                  <a 
                    href="tel:+905323590515" 
                    className="text-green-600 text-lg hover:text-green-700 transition-colors font-medium"
                  >
                    0532 359 0515
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-4 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-700 font-semibold text-lg">Adres</h4>
                  <p className="text-gray-600">Bağlar Mah, Atatürk Cd. No: 195, 31500 Reyhanlı/Hatay</p>
                  <a 
                    href="https://maps.google.com/?q=Bağlar+Mah,+Atatürk+Cd.+No:+195,+31500+Reyhanlı/Hatay" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <span>Haritada Göster</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  <span>Menüye Dön</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export async function getStaticProps() {
  try {
    // Hardcoded URL kullanın
    const baseUrl = "https://villapark.vercel.app";
    
    // API endpoint'i çağırın
    const response = await fetch(`${baseUrl}/api/categories`);
    
    // HTTP durumunu kontrol edin
    if (!response.ok) {
      console.error(`API hatası: ${response.status} ${response.statusText}`);
      throw new Error(`API çağrısı başarısız: ${response.status}`);
    }
    
    const initialCategories = await response.json();

    return {
      props: {
        initialCategories,
      },
      revalidate: 3600 // 1 saat arayla yeniden oluştur
    };
  } catch (error) {
    console.error('Kategoriler getirilemedi:', error);
    return {
      props: {
        initialCategories: [],
      },
      revalidate: 3600
    };
  }
}

export default Home;
