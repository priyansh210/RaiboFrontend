
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface SaveConfirmationDialogProps {
  isOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export const SaveConfirmationDialog: React.FC<SaveConfirmationDialogProps> = ({
  isOpen,
  onSave,
  onDiscard,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-[90vw] sm:max-w-md bg-card text-card-foreground p-4 sm:p-6 shadow-xl dark:border-muted">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            <DialogTitle className="text-base sm:text-lg text-foreground dark:text-white">Unsaved Changes</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-3 sm:py-4">
          <p className="text-sm sm:text-base text-foreground dark:text-slate-200">
            You have unsaved changes. What would you like to do?
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end mt-2">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto dark:border-slate-600 dark:text-white">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDiscard} className="w-full sm:w-auto">
            Don't Save
          </Button>
          <Button onClick={onSave} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
