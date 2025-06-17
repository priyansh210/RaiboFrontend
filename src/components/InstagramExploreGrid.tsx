
import React from 'react';
import { Product } from '@/models/internal/Product';
import { useNavigate } from 'react-router-dom';

interface InstagramExploreGridProps {
  products: Product[];
}

const InstagramExploreGrid: React.FC<InstagramExploreGridProps> = ({ products }) => {
  const navigate = useNavigate();

  const handlePostClick = (productIndex: number) => {
    navigate(`/for-you/feed/${productIndex}`);
  };

  // Create a pattern for the grid layout
  const getItemClass = (index: number) => {
    const patterns = [
      'col-span-1 row-span-2', // tall
      'col-span-1 row-span-1', // small
      'col-span-1 row-span-1', // small
      'col-span-2 row-span-1', // wide
      'col-span-1 row-span-1', // small
      'col-span-1 row-span-2', // tall
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="grid grid-cols-3 gap-1 p-1">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`${getItemClass(index)} relative cursor-pointer group overflow-hidden bg-muted rounded-sm`}
          onClick={() => handlePostClick(index)}
        >
          <img
            src={product.displayImage || product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Overlay with engagement stats */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-sm font-semibold">{product.interactions?.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M21 6h-2l-1.27-1.27c-.4-.4-.93-.73-1.73-.73H8c-.8 0-1.33.33-1.73.73L5 6H3c-.55 0-1 .45-1 1s.45 1 1 1h1v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h1c.55 0 1-.45 1-1s-.45-1-1-1zM8 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                </svg>
                <span className="text-sm font-semibold">{product.interactions?.comments?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Product info overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <p className="text-white text-xs font-medium truncate">{product.name}</p>
            <p className="text-white/80 text-xs">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InstagramExploreGrid;
