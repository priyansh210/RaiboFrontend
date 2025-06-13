
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <DialogTitle>Unsaved Changes</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-600">
            You have unsaved changes. What would you like to do?
          </p>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDiscard}>
            Don't Save
          </Button>
          <Button onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
