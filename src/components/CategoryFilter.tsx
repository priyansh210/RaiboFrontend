import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

interface FilterGroup {
  name: string;
  options: FilterOption[];
}

interface CategoryFilterProps {
  filters: FilterGroup[];
  onFilterChange: (group: string, selectedOptions: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ filters, onFilterChange }) => {
  const { theme } = useTheme();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(filters.map(group => [group.name, true]))
  );
  const [selectedFilters, setSelectedFilters] = useState<Record<string, Set<string>>>({});

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleFilterSelect = (groupName: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[groupName]) {
        newFilters[groupName] = new Set([optionId]);
      } else {
        const groupSet = new Set(newFilters[groupName]);
        if (groupSet.has(optionId)) {
          groupSet.delete(optionId);
        } else {
          groupSet.add(optionId);
        }
        newFilters[groupName] = groupSet;
      }
      
      onFilterChange(groupName, Array.from(newFilters[groupName]));
      return newFilters;
    });
  };

  return (
    <div
      className="p-6 rounded-sm transition-all duration-300 hover:card-shadow"
      style={{ backgroundColor: theme.background }}
    >
      <h2 className="font-playfair text-xl mb-6" style={{ color: theme.foreground }}>Filters</h2>
      <div className="space-y-6">
        {filters.map((group) => (
          <div key={group.name} className="border-b pb-4" style={{ borderColor: theme.border }}>
            <button
              className="flex items-center justify-between w-full text-left py-2"
              onClick={() => toggleGroup(group.name)}
            >
              <h3 className="font-medium" style={{ color: theme.foreground }}>{group.name}</h3>
              {expandedGroups[group.name] ? (
                <ChevronUp size={18} style={{ color: theme.mutedForeground }} />
              ) : (
                <ChevronDown size={18} style={{ color: theme.mutedForeground }} />
              )}
            </button>
            {expandedGroups[group.name] && (
              <div className="mt-3 space-y-2">
                {group.options.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      style={{ borderColor: theme.border, accentColor: theme.primary }}
                      checked={selectedFilters[group.name]?.has(option.id) || false}
                      onChange={() => handleFilterSelect(group.name, option.id)}
                    />
                    <span className="text-sm flex-grow" style={{ color: theme.mutedForeground }}>{option.name}</span>
                    {option.count !== undefined && (
                      <span className="text-xs" style={{ color: theme.mutedForeground }}>{option.count}</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {Object.keys(selectedFilters).some(group => selectedFilters[group].size > 0) && (
        <button
          className="mt-6 w-full py-2 text-sm rounded-sm transition-colors"
          style={{ color: theme.primary }}
          onClick={() => {
            setSelectedFilters({});
            filters.forEach(group => {
              onFilterChange(group.name, []);
            });
          }}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
