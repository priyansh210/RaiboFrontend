import React, { useState, useCallback } from 'react';
import { RaiBoardTextElement } from '@/models/internal/RaiBoard';
import { CanvasItem } from './CanvasItem';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';

interface TextElementProps {
  element: RaiBoardTextElement;
  isSelected: boolean;
  canEdit: boolean;
  onMove: (elementId: string, position: { x: number; y: number }, zIndex?: number) => void;
  onResize: (elementId: string, size: { width: number; height: number }) => void;
  onUpdate: (elementId: string, updates: Partial<RaiBoardTextElement>) => void;
  onRemove: (elementId: string) => void;
  onSelect: (elementId: string) => void;
  zoom: number;
}

export const TextElement: React.FC<TextElementProps> = ({
  element,
  isSelected,
  canEdit,
  onMove,
  onResize,
  onUpdate,
  onRemove,
  onSelect,
  zoom,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);

  const handleDoubleClick = useCallback(() => {
    if (canEdit) {
      setIsEditing(true);
    }
  }, [canEdit]);

  const handleSaveEdit = () => {
    onUpdate(element.id, { content: editContent });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(element.content);
    setIsEditing(false);
  };

  return (
    <CanvasItem
      id={element.id}
      position={element.position}
      size={element.size}
      zIndex={element.zIndex}
      isSelected={isSelected}
      canEdit={canEdit && !isEditing}
      onMove={onMove}
      onResize={onResize}
      onRemove={onRemove}
      onSelect={onSelect}
      onDoubleClick={handleDoubleClick}
      zoom={zoom}
      resizable={true}
      className="group"
    >
      {isEditing ? (
        <div className="w-full h-full bg-card rounded-lg shadow-lg border-2 border-blue-500 p-3">
          {element.type === 'heading' ? (
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-2"
              placeholder="Enter heading..."
              autoFocus
            />
          ) : (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-2 resize-none"
              placeholder="Enter paragraph..."
              rows={3}
              autoFocus
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-card/95 backdrop-blur-sm rounded-lg shadow-sm border border-border p-3 overflow-hidden group-hover:shadow-md transition-shadow duration-200">
          {element.type === 'heading' ? (
            <h2
              style={{
                fontSize: element.fontSize,
                fontWeight: element.fontWeight,
                color: element.color,
              }}
              className="break-words leading-tight"
            >
              {element.content || 'Double-click to edit heading'}
            </h2>
          ) : (
            <p
              style={{
                fontSize: element.fontSize,
                fontWeight: element.fontWeight,
                color: element.color,
              }}
              className="break-words leading-relaxed"
            >
              {element.content || 'Double-click to edit paragraph'}
            </p>
          )}

          {/* Edit Indicator */}
          {canEdit && !isEditing && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-gray-400 dark:bg-gray-600 rounded-full opacity-0 group-hover:opacity-70 flex items-center justify-center transition-opacity duration-200">
              <Edit3 className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      )}
    </CanvasItem>
  );
};
