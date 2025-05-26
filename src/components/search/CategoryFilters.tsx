
import React from 'react';

interface CategoryFilter {
  name: string;
  options: { id: string; name: string; count: number; }[];
}

interface CategoryFiltersProps {
  categories: CategoryFilter[];
  searchTerm: string;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categories, searchTerm }) => {
  const filteredCategories = searchTerm 
    ? categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.options.some(option => 
          option.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : categories;

  return (
    <div className="space-y-4">
      {filteredCategories.map((category) => (
        <div key={category.name} className="border-b border-sand pb-4">
          <h3 className="font-medium text-charcoal mb-2">{category.name}</h3>
          <div className="space-y-1">
            {category.options.map((option) => (
              <label key={option.id} className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-earth">{option.name} ({option.count})</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilters;
