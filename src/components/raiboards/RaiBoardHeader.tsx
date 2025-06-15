
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Save, Users } from 'lucide-react';

interface RaiBoardHeaderProps {
  boardName: string;
  boardDescription?: string;
  isPublic: boolean;
  hasUnsavedChanges: boolean;
  saving: boolean;
  userRole: 'owner' | 'editor' | 'viewer';
  onNavigateBack: () => void;
  onSave: () => void;
  onShare: () => void;
  onSettings?: () => void;
}

export const RaiBoardHeader: React.FC<RaiBoardHeaderProps> = ({
  boardName,
  boardDescription,
  isPublic,
  hasUnsavedChanges,
  saving,
  userRole,
  onNavigateBack,
  onSave,
  onShare,
  onSettings,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateBack}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-lg">{boardName}</h1>
            {hasUnsavedChanges && (
              <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
            )}
          </div>
          {boardDescription && (
            <p className="text-sm text-gray-600">{boardDescription}</p>
          )}
        </div>
        
        {isPublic && (
          <Badge variant="secondary">Public</Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={hasUnsavedChanges ? "default" : "outline"}
          size="sm"
          onClick={onSave}
          disabled={saving || userRole === 'viewer'}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : hasUnsavedChanges ? 'Save*' : 'Save'}
        </Button>
        
        <Button variant="outline" size="sm" onClick={onShare}>
          <Users className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
