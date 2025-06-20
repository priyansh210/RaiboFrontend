
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Users, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

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
  collaboratorCount: number;
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
  collaboratorCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`bg-card text-card-foreground border-b border-border px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between transition-all duration-300 ${isExpanded ? 'pb-6' : ''}`}>
      {/* Top row - always visible */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateBack}
            className="p-1 md:p-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-base md:text-lg truncate max-w-[150px] md:max-w-none">
                {boardName}
              </h1>
              {hasUnsavedChanges && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
              )}
              {isPublic && (
                <Badge variant="secondary" className="hidden md:inline-flex">Public</Badge>
              )}
            </div>
            {boardDescription && !isExpanded && (
              <p className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-md hidden md:block">
                {boardDescription}
              </p>
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Save button always visible on mobile */}
          <Button
            variant={hasUnsavedChanges ? "default" : "outline"}
            size="sm"
            onClick={onSave}
            disabled={saving || userRole === 'viewer'}
            className="h-8 px-2"
          >
            <Save className="w-4 h-4 mr-1" />
            <span className="text-xs">{saving ? 'Saving...' : 'Save'}</span>
          </Button>
          
          {/* Dropdown for other actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onShare}>
                  <Users className="w-4 h-4 mr-2" />
                  Share
                  {collaboratorCount > 0 && (
                    <Badge variant="secondary" className="ml-2">{collaboratorCount}</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? 'Hide details' : 'Show details'}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
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
            {collaboratorCount > 0 && (
              <Badge variant="secondary" className="ml-2">{collaboratorCount}</Badge>
            )}
          </Button>
        </div>
      </div>
      
      {/* Expanded mobile content */}
      {isExpanded && (
        <div className="mt-3 md:hidden">
          {boardDescription && (
            <p className="text-sm text-muted-foreground">
              {boardDescription}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {isPublic && (
              <Badge variant="secondary">Public</Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {collaboratorCount} {collaboratorCount === 1 ? 'collaborator' : 'collaborators'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
