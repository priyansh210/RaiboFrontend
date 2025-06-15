
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRaiBoard } from '@/context/RaiBoardContext';

export const useBoardNavigation = (onSave: () => Promise<void>) => {
  const navigate = useNavigate();
  const { state } = useRaiBoard();
  
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [pendingNavigationPath, setPendingNavigationPath] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  const navigateWithConfirmation = (path: string) => {
    if (state.hasUnsavedChanges) {
      setPendingNavigationPath(path);
      setShowSaveConfirmation(true);
    } else {
      navigate(path);
    }
  };

  const handleSaveAndNavigate = async () => {
    await onSave();
    if (pendingNavigationPath) {
      navigate(pendingNavigationPath);
    }
    setShowSaveConfirmation(false);
    setPendingNavigationPath(null);
  };

  const handleDiscardAndNavigate = () => {
    if (pendingNavigationPath) {
      navigate(pendingNavigationPath);
    }
    setShowSaveConfirmation(false);
    setPendingNavigationPath(null);
  };

  const handleCancelNavigation = () => {
    setShowSaveConfirmation(false);
    setPendingNavigationPath(null);
  };

  return {
    showSaveConfirmation,
    navigateWithConfirmation,
    handleSaveAndNavigate,
    handleDiscardAndNavigate,
    handleCancelNavigation,
  };
};
