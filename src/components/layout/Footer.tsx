import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-600 text-white py-6 mt-12 relative">
      {/* Dekoratif dalga deseni */}
      <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden">
        <div className="absolute h-16 w-[200%] top-0 left-0" 
             style={{ 
               backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
               backgroundSize: '60px 30px',
               backgroundRepeat: 'repeat-x',
               transform: 'translateY(-24px)'
             }}>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold font-serif flex items-center">
              <span className="mr-2 inline-block w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <span className="w-3 h-3 bg-white rounded-full"></span>
              </span>
              VillaPark
            </h3>
            <p className="text-sm mt-1 text-green-100">Lezzetin ve huzurun adresi</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">© {new Date().getFullYear()} VillaPark Cafe & Restaurant</p>
            <p className="text-xs mt-1 text-green-100">Tüm hakları saklıdır.</p>
          </div>
        </div>
        
        {/* Dekoratif çizgi */}
        <div className="mt-4 pt-4 border-t border-white/20 text-center">
          <div className="inline-flex items-center">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-green-200"></div>
            <div className="mx-2 text-xs text-green-100">VillaPark</div>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-green-200"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;