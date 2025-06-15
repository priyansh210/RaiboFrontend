
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Type, Heading, Image, Square, Palette, Grid3X3, Move, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface ToolbarButtonProps {
    label: string;
    icon: React.ElementType;
    isCollapsed: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ label, icon: Icon, isCollapsed, onClick, disabled }) => {
    const button = (
        <Button
          variant="ghost"
          className={cn("w-full justify-start h-9", isCollapsed ? "justify-center px-2" : "px-3")}
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2 text-sm font-medium">{label}</span>}
        </Button>
    );

    if (isCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        );
    }
    return button;
}

export const RaiBoardToolbar: React.FC<RaiBoardToolbarProps> = ({
  onAddProduct,
  onAddHeading,
  onAddParagraph,
  onAddImage,
  userRole,
  boardStats,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const canEdit = userRole === 'owner' || userRole === 'editor';

  return (
    <TooltipProvider delayDuration={0}>
        <div className={cn("bg-white border-r border-gray-200 flex flex-col h-full relative transition-all duration-300 ease-in-out", isCollapsed ? "w-20" : "w-64")}>
            
            <Button 
              variant="outline"
              size="icon" 
              className="absolute -right-4 top-8 bg-white h-8 w-8 rounded-full z-10 hover:bg-gray-100"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
                <span className="sr-only">Toggle Toolbar</span>
            </Button>

            <div className={cn("p-4 border-b border-gray-100 h-[69px]")}>
                <div className={cn(isCollapsed && "hidden")}>
                    <h3 className="font-semibold text-lg text-gray-900">Tools</h3>
                    <p className="text-sm text-gray-600">Add elements</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
                <div className="space-y-1">
                    {!isCollapsed && <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider px-3 pb-2">Add Elements</h4>}
                    <ToolbarButton label="Add Product" icon={Square} isCollapsed={isCollapsed} onClick={onAddProduct} disabled={!canEdit} />
                    <ToolbarButton label="Add Heading" icon={Heading} isCollapsed={isCollapsed} onClick={onAddHeading} disabled={!canEdit} />
                    <ToolbarButton label="Add Paragraph" icon={Type} isCollapsed={isCollapsed} onClick={onAddParagraph} disabled={!canEdit} />
                    <ToolbarButton label="Add Image" icon={Image} isCollapsed={isCollapsed} onClick={onAddImage} disabled={!canEdit} />
                </div>

                <Separator className={cn('my-4', isCollapsed && 'mx-auto w-1/2')} />

                <div className="px-3 space-y-2">
                    {!isCollapsed && <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider pb-2">Board Stats</h4>}
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between items-center h-8">
                            {isCollapsed ? 
                                <Tooltip><TooltipTrigger><Square className="w-4 h-4 text-gray-600" /></TooltipTrigger><TooltipContent side="right" sideOffset={5}><p>Products</p></TooltipContent></Tooltip>
                                : <span className="text-gray-600">Products</span>
                            }
                            <span className="font-medium bg-gray-100 rounded px-1.5 py-0.5 text-xs">{boardStats.products}</span>
                        </div>
                        <div className="flex justify-between items-center h-8">
                            {isCollapsed ? 
                                <Tooltip><TooltipTrigger><Type className="w-4 h-4 text-gray-600" /></TooltipTrigger><TooltipContent side="right" sideOffset={5}><p>Text Elements</p></TooltipContent></Tooltip>
                                : <span className="text-gray-600">Text Elements</span>
                            }
                            <span className="font-medium bg-gray-100 rounded px-1.5 py-0.5 text-xs">{boardStats.textElements}</span>
                        </div>
                    </div>
                </div>

                <Separator className={cn('my-4', isCollapsed && 'mx-auto w-1/2')} />
                
                <div className="space-y-1">
                    {!isCollapsed && <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider px-3 pb-2">Quick Actions</h4>}
                    <ToolbarButton label="Change Theme" icon={Palette} isCollapsed={isCollapsed} disabled={!canEdit} />
                    <ToolbarButton label="Reset View" icon={RotateCcw} isCollapsed={isCollapsed} disabled={!canEdit} />
                </div>
            </div>

            {!isCollapsed && (
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
            )}
        </div>
    </TooltipProvider>
  );
};
