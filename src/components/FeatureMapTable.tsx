import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import ProductPreview from './ProductPreview';

interface FeatureMapTableProps {
  featureMap: Record<string, string>;
  onChange: (map: Record<string, string>) => void;
}

const FeatureMapTable: React.FC<FeatureMapTableProps> = ({ featureMap, onChange }) => {
  const [rows, setRows] = useState(Object.entries(featureMap));
  const [newFeature, setNewFeature] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [featureAutocomplete, setFeatureAutocomplete] = useState<string[]>([]);
  const navigate = useNavigate();
  const { productId } = useParams();

  // Dummy feature suggestions for autocomplete
  const FEATURE_SUGGESTIONS = [
    'Material',
    'Color',
    'Dimensions',
    'Weight',
    'Finish',
    'Warranty',
    'Assembly',
    'Style',
    'Brand',
    'Origin',
    'Care Instructions',
    'Capacity',
    'Power',
    'Frame Material',
    'Upholstery',
    'Filling',
    'Height',
    'Width',
    'Depth',
    'Max Load',
    'Eco Friendly',
    'Handmade',
    'Foldable',
    'Stackable',
    'Water Resistant',
    'Fire Retardant',
  ];

  // Keep rows in sync with featureMap prop
  React.useEffect(() => {
    setRows(Object.entries(featureMap));
  }, [featureMap]);

  // Autocomplete feature suggestions
  React.useEffect(() => {
    if (newFeature.length > 0) {
      setFeatureAutocomplete(
        FEATURE_SUGGESTIONS.filter(f => f.toLowerCase().includes(newFeature.toLowerCase()) && !rows.some(([r]) => r.toLowerCase() === f.toLowerCase()))
      );
    } else {
      setFeatureAutocomplete([]);
    }
  }, [newFeature, rows]);

  const handleAddRow = () => {
    if (!newFeature.trim()) return;
    const updated: [string, string][] = [...rows, [newFeature, newValue]];
    setRows(updated);
    setNewFeature('');
    setNewValue('');
    onChange(Object.fromEntries(updated));
  };

  const handleRemoveRow = (idx: number) => {
    const updated: [string, string][] = rows.filter((_, i) => i !== idx);
    setRows(updated);
    onChange(Object.fromEntries(updated));
  };

  const handleEditRow = (idx: number, key: string, value: string) => {
    const updated: [string, string][] = rows.map((row, i) =>
      i === idx ? [key, value] as [string, string] : row
    );
    setRows(updated);
    onChange(Object.fromEntries(updated));
  };

  const handleAutocompleteSelect = (suggestion: string) => {
    setNewFeature(suggestion);
    setFeatureAutocomplete([]);
  };

  // Handle Tab key for autocomplete
  const handleNewFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (featureAutocomplete.length > 0 && e.key === 'Tab') {
      e.preventDefault();
      setNewFeature(featureAutocomplete[0]);
      setFeatureAutocomplete([]);
    }
  };

  return (
    <div>
      <table className="w-full mb-2 border">
        <thead>
          <tr>
            <th className="p-2 border">Feature</th>
            <th className="p-2 border">Value</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([feature, value], idx) => (
            <tr key={idx}>
              <td className="p-2 border">
                <Input
                  value={feature}
                  onChange={e => handleEditRow(idx, e.target.value, value)}
                  placeholder="Feature name"
                />
              </td>
              <td className="p-2 border">
                <Input
                  value={value}
                  onChange={e => handleEditRow(idx, feature, e.target.value)}
                  placeholder="Feature value"
                />
              </td>
              <td className="p-2 border">
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveRow(idx)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="p-2 border">
              <div className="relative">
                <Input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  onKeyDown={handleNewFeatureKeyDown}
                  placeholder="New feature"
                  autoComplete="off"
                />
                {featureAutocomplete.length > 0 && (
                  <div className="absolute left-0 right-0 bg-white border border-gray-200 z-10 rounded shadow mt-1 max-h-40 overflow-y-auto">
                    {featureAutocomplete.map((suggestion) => (
                      <div
                        key={suggestion}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleAutocompleteSelect(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </td>
            <td className="p-2 border">
              <Input
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="New value"
              />
            </td>
            <td className="p-2 border">
              <Button type="button" size="sm" onClick={handleAddRow}>
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FeatureMapTable;
