
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Type, Heading, Image, Square, Circle, Palette, Grid3X3, Move, RotateCcw } from 'lucide-react';

interface RaiBoardToolbarProps {
  onAddProduct: () => void;
  onAddHeading: () => void;
  onAddParagraph: () => void;
  onAddImage: () => void;
  userRole: 'owner' | 'editor' | 'viewer';
  boardStats: {
    products: number;
    textElements: number;
  };
}

export const RaiBoardToolbar: React.FC<RaiBoardToolbarProps> = ({
  onAddProduct,
  onAddHeading,
  onAddParagraph,
  onAddImage,
  userRole,
  boardStats,
}) => {
  const canEdit = userRole === 'owner' || userRole === 'editor';

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-lg text-gray-900">Tools</h3>
        <p className="text-sm text-gray-600">Add elements to your board</p>
      </div>

      {/* Add Elements Section */}
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Elements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddProduct}
              disabled={!canEdit}
              className="w-full justify-start"
            >
              <Square className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAddHeading}
              disabled={!canEdit}
              className="w-full justify-start"
            >
              <Heading className="w-4 h-4 mr-2" />
              Add Heading
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAddParagraph}
              disabled={!canEdit}
              className="w-full justify-start"
            >
              <Type className="w-4 h-4 mr-2" />
              Add Paragraph
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAddImage}
              disabled={!canEdit}
              className="w-full justify-start"
            >
              <Image className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </CardContent>
        </Card>

        {/* Board Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Board Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Products</span>
              <span className="font-medium">{boardStats.products}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Text Elements</span>
              <span className="font-medium">{boardStats.textElements}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Move className="w-4 h-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!canEdit}
              className="w-full justify-start"
            >
              <Palette className="w-4 h-4 mr-2" />
              Change Theme
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!canEdit}
              className="w-full justify-start"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <div className="bg-blue-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Quick Tips</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Double-click text to edit</li>
            <li>• Drag to move elements</li>
            <li>• Use corner handles to resize</li>
            <li>• Ctrl+scroll to zoom</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
