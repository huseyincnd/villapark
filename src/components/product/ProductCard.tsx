import React from 'react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-green-100 group relative">
      {/* Fiyat etiketi */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white px-3 py-1 rounded-full shadow-md text-lg font-bold text-green-600 border border-green-100 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
          {product.price}
        </div>
      </div>
      
      <div className="relative h-56 w-full">
        {/* Görsel yoksa placeholdergöster */}
        {product.image ? (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent opacity-60"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-green-100 flex items-center justify-center">
            <span className="text-green-400">Görsel Yok</span>
          </div>
        )}
      </div>
      <div className="p-5 relative">
        {/* Dekoratif çizgi */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-green-200 via-green-500 to-green-200 rounded-full"></div>
        
        <div className="pt-3">
          <h3 className="text-xl font-bold text-green-800 font-serif">
            {product.name}
          </h3>
          <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 