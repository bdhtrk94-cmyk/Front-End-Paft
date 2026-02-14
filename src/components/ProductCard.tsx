'use client';

import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
  onQuoteRequest?: (productId: number) => void;
  onViewDetails?: (productId: number) => void;
}

export default function ProductCard({ 
  product, 
  showActions = true, 
  onQuoteRequest, 
  onViewDetails 
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">Product Image</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
          <span className="text-2xl font-bold text-paft-primary">{product.price}</span>
        </div>
        
        <p className="text-gray-600 mb-4">{product.description}</p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Specifications:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><span className="font-medium">Dimensions:</span> {product.dimensions || 'N/A'}</li>
            <li><span className="font-medium">Weight:</span> {product.weight || 'N/A'}</li>
            <li><span className="font-medium">Static Load:</span> {product.staticLoad || 'N/A'}</li>
          </ul>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        {showActions && (
          <div className="flex gap-3">
            <button 
              onClick={() => onQuoteRequest?.(product.id)}
              className="flex-1 bg-paft-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-paft-primary-dark transition-colors"
            >
              Get Quote
            </button>
            <button 
              onClick={() => onViewDetails?.(product.id)}
              className="flex-1 border border-paft-primary text-paft-primary py-2 px-4 rounded-lg font-semibold hover:bg-paft-primary hover:bg-opacity-10 transition-colors"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}