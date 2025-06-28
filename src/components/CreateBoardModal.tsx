import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/hooks/use-toast';
import { raiBoardService } from '@/services/RaiBoardService';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newBoard, setNewBoard] = useState({
    name: '',
    description: '',
    isPublic: false,
  });
  const [creating, setCreating] = useState(false);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoard.name.trim()) return;
    
    setCreating(true);
    try {
      const created = await raiBoardService.createBoard(newBoard);
      toast({ 
        title: 'Board Created', 
        description: `Board "${created.name}" created successfully.` 
      });
      setNewBoard({ name: '', description: '', isPublic: false });
      onSuccess();
      onClose();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to create board', 
        variant: 'destructive' 
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Create a new board to collect and organize your inspiration.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCreateBoard} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="boardName">Board Name</Label>
            <Input
              id="boardName"
              placeholder="Enter board name"
              value={newBoard.name}
              onChange={e => setNewBoard(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="boardDescription">Description (Optional)</Label>
            <Textarea
              id="boardDescription"
              placeholder="Enter a short description"
              value={newBoard.description}
              onChange={e => setNewBoard(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="boardVisibility"
              checked={newBoard.isPublic}
              onCheckedChange={(checked) => setNewBoard(prev => ({ ...prev, isPublic: checked }))}
            />
            <Label htmlFor="boardVisibility">Make board public</Label>
          </div>
          
          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto order-1 sm:order-none">
              Cancel
            </Button>
            <Button type="submit" disabled={creating} className="w-full sm:w-auto">
              {creating ? 'Creating...' : 'Create Board'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardModal;
