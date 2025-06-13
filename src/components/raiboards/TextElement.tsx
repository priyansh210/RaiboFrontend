
import React, { useState, useRef, useCallback } from 'react';
import { RaiBoardTextElement } from '@/models/internal/RaiBoard';
import { X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canEdit || isEditing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.position.x * zoom,
      y: e.clientY - element.position.y * zoom,
    });
    onSelect(element.id);
  }, [canEdit, isEditing, element.position, element.id, onSelect, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !canEdit) return;
    
    const newX = (e.clientX - dragStart.x) / zoom;
    const newY = (e.clientY - dragStart.y) / zoom;
    
    onMove(element.id, { x: newX, y: newY });
  }, [isDragging, canEdit, dragStart, element.id, onMove, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  }, [element.id, onSelect]);

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

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(element.id);
  }, [element.id, onRemove]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  return (
    <div
      ref={elementRef}
      className={`absolute select-none cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isDragging ? 'opacity-80' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        zIndex: element.zIndex + (isSelected ? 1000 : 0),
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          {element.type === 'heading' ? (
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-2"
              placeholder="Enter heading..."
            />
          ) : (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-2 resize-none"
              placeholder="Enter paragraph..."
              rows={3}
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white/90 rounded-lg shadow-sm border border-gray-200 p-3 overflow-hidden">
          {element.type === 'heading' ? (
            <h2
              style={{
                fontSize: element.fontSize,
                fontWeight: element.fontWeight,
                color: element.color,
              }}
              className="break-words"
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
              className="break-words"
            >
              {element.content || 'Double-click to edit paragraph'}
            </p>
          )}
        </div>
      )}

      {/* Remove Button */}
      {isSelected && canEdit && !isEditing && (
        <Button
          size="sm"
          variant="destructive"
          className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
          onClick={handleRemove}
        >
          <X className="w-3 h-3" />
        </Button>
      )}

      {/* Resize Handle */}
      {isSelected && canEdit && !isEditing && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}

      {/* Edit Indicator */}
      {canEdit && !isEditing && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-gray-400 rounded-full opacity-50 flex items-center justify-center">
          <Edit3 className="w-2 h-2 text-white" />
        </div>
      )}
    </div>
  );
};
