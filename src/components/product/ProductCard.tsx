import React from 'react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-green-100 group">
      <div className="relative h-56 w-full">
        {/* Görsel yoksa placeholder göster */}
        {product.image ? (
          <div className="absolute inset-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent opacity-60"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-green-100 flex items-center justify-center">
            <span className="text-green-400">Görsel Yok</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-green-800 font-serif">{product.name}</h3>
          <span className="text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
            {product.price}
          </span>
        </div>
        <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductCard; 