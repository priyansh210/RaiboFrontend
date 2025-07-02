import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRaiBoard } from '@/context/RaiBoardContext';
import { raiBoardService } from '@/services/RaiBoardService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useBoardData = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, dispatch } = useRaiBoard();
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (boardId) {
      loadBoard();
    }
  }, [boardId]);

  const loadBoard = async () => {
    if (!boardId) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const boardData = await raiBoardService.getBoardById(boardId);
      dispatch({ type: 'SET_BOARD', payload: boardData });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load board',
        variant: 'destructive',
      });
      navigate('/raiboards');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveBoard = async () => {
    if (!state.board) return;
    
    try {
      setIsSaving(true);
      await raiBoardService.saveBoard(state.board);
      dispatch({ type: 'MARK_SAVED' });
      toast({
        title: 'Success',
        description: 'Board saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save board',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    board: state.board,
    isLoading: state.isLoading,
    hasUnsavedChanges: state.hasUnsavedChanges,
    isSaving,
    saveBoard,
    user,
  };
};
