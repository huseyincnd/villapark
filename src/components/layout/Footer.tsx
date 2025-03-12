import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-600 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold font-serif">VillaPark</h3>
            <p className="text-sm mt-1">Lezzetin ve huzurun adresi</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">© {new Date().getFullYear()} VillaPark Cafe & Restaurant</p>
            <p className="text-xs mt-1">Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 