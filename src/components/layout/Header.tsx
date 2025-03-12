import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="text-3xl font-bold font-serif tracking-wider">VillaPark</span>
              <span className="ml-2 text-sm italic font-light">Cafe & Restaurant</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 