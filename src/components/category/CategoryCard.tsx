import React from 'react';
import Link from 'next/link';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/category/${category.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border border-green-100">
        <div className="relative h-56 w-full">
          {category.image ? (
            <div className="absolute inset-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-green-100 flex items-center justify-center">
              <span className="text-green-400">Görsel Yok</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-2xl font-bold font-serif">{category.name}</h3>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-r from-green-50 to-white">
          <div className="flex justify-between items-center">
            <p className="text-green-700">{category.products.length} ürün</p>
            <span className="text-green-600 flex items-center">
              Görüntüle
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 