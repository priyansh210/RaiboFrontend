
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
          className={cn(
            "w-full justify-start h-8 md:h-9", 
            isCollapsed 
              ? "justify-center px-1 md:px-2" 
              : "px-2 md:px-3"
          )}
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className="w-3 h-3 md:w-4 md:h-4" />
          {!isCollapsed && <span className="ml-2 text-xs md:text-sm font-medium truncate">{label}</span>}
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const canEdit = userRole === 'owner' || userRole === 'editor';

  // Auto collapse on small screens
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
        <div className={cn(
          "bg-card border-r border-border flex flex-col h-full relative transition-all duration-300 ease-in-out z-20", 
          isCollapsed ? "w-[50px] md:w-16" : "w-64"
        )}>
            
            <Button 
              variant="outline"
              size="icon" 
              className="absolute -right-3 md:-right-4 top-8 bg-card h-6 w-6 md:h-8 md:w-8 rounded-full z-10 hover:bg-muted shadow-sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <ChevronsRight className="w-3 h-3 md:w-4 md:h-4" /> : <ChevronsLeft className="w-3 h-3 md:w-4 md:h-4" />}
                <span className="sr-only">Toggle Toolbar</span>
            </Button>            <div className={cn("p-2 md:p-4 border-b border-border h-[50px] md:h-[69px] flex items-center justify-center md:justify-start")}>
                <div className={cn(isCollapsed ? "hidden" : "block")}>
                    <h3 className="font-semibold text-lg text-foreground">Tools</h3>
                    <p className="text-sm text-muted-foreground">Add elements</p>
                </div>
                {isCollapsed && (
                  <span className="text-xs font-semibold text-muted-foreground">Tools</span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-1 md:px-2 py-2 md:py-4 space-y-2 md:space-y-4">
                <div className="space-y-1">
                    {!isCollapsed && <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-3 pb-2">Add Elements</h4>}
                    <ToolbarButton label="Add Product" icon={Square} isCollapsed={isCollapsed} onClick={onAddProduct} disabled={!canEdit} />
                    <ToolbarButton label="Add Heading" icon={Heading} isCollapsed={isCollapsed} onClick={onAddHeading} disabled={!canEdit} />
                    <ToolbarButton label="Add Paragraph" icon={Type} isCollapsed={isCollapsed} onClick={onAddParagraph} disabled={!canEdit} />
                    <ToolbarButton label="Add Image" icon={Image} isCollapsed={isCollapsed} onClick={onAddImage} disabled={!canEdit} />
                </div>

                <Separator className={cn('my-4', isCollapsed && 'mx-auto w-1/2')} />

                <div className="px-3 space-y-2">
                    {!isCollapsed && <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider pb-2">Board Stats</h4>}
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between items-center h-8">
                            {isCollapsed ? 
                                <Tooltip><TooltipTrigger><Square className="w-4 h-4 text-muted-foreground" /></TooltipTrigger><TooltipContent side="right" sideOffset={5}><p>Products</p></TooltipContent></Tooltip>
                                : <span className="text-muted-foreground">Products</span>
                            }
                            <span className="font-medium bg-muted text-foreground rounded px-1.5 py-0.5 text-xs">{boardStats.products}</span>
                        </div>
                        <div className="flex justify-between items-center h-8">
                            {isCollapsed ? 
                                <Tooltip><TooltipTrigger><Type className="w-4 h-4 text-muted-foreground" /></TooltipTrigger><TooltipContent side="right" sideOffset={5}><p>Text Elements</p></TooltipContent></Tooltip>
                                : <span className="text-muted-foreground">Text Elements</span>
                            }
                            <span className="font-medium bg-muted text-foreground rounded px-1.5 py-0.5 text-xs">{boardStats.textElements}</span>
                        </div>
                    </div>
                </div>

                <Separator className={cn('my-4', isCollapsed && 'mx-auto w-1/2')} />
                
                <div className="space-y-1">
                    {!isCollapsed && <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-3 pb-2">Quick Actions</h4>}
                    <ToolbarButton label="Change Theme" icon={Palette} isCollapsed={isCollapsed} disabled={!canEdit} />
                    <ToolbarButton label="Reset View" icon={RotateCcw} isCollapsed={isCollapsed} disabled={!canEdit} />
                </div>
            </div>

            {!isCollapsed && (
              <div className="mt-auto p-4 border-t border-border">
                <div className="bg-primary/10 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-primary mb-1">Quick Tips</h4>
                  <ul className="text-xs text-primary/80 space-y-1">
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
