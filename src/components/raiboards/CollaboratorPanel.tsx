
import React, { useState } from 'react';
import { RaiBoardCollaborator } from '@/models/internal/RaiBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Mail, Crown, Edit, Eye } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface CollaboratorPanelProps {
  collaborators: RaiBoardCollaborator[];
  onInviteCollaborator: (email: string, role: 'editor' | 'viewer') => void;
  userRole: 'owner' | 'editor' | 'viewer';
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const CollaboratorPanel: React.FC<CollaboratorPanelProps> = ({
  collaborators,
  onInviteCollaborator,
  userRole,
  isOpen,
  onOpenChange,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInviteCollaborator(inviteEmail.trim(), inviteRole);
      setInviteEmail('');
    }
  };

  const canInvite = userRole === 'owner' || userRole === 'editor';

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3" />;
      case 'editor': return <Edit className="w-3 h-3" />;
      case 'viewer': return <Eye className="w-3 h-3" />;
      default: return null;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default';
      case 'editor': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col bg-card text-card-foreground">
        <SheetHeader>
          <SheetTitle>Share Board</SheetTitle>
          <SheetDescription>
            Invite collaborators to work on this board with you.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaborators ({collaborators.length})
          </h3>
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={collaborator.userAvatar} />
                  <AvatarFallback>
                    {collaborator.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {collaborator.userName}
                    </span>
                    {collaborator.isOnline && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                  <Badge
                    variant={getRoleBadgeVariant(collaborator.role)}
                    className="text-xs flex items-center gap-1 w-fit"
                  >
                    {getRoleIcon(collaborator.role)}
                    {collaborator.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {canInvite && (
          <div className="pt-4 border-t space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invite new collaborator
            </h3>
            
            <div className="space-y-2">
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
              />
              
              <div className="flex gap-2">
                <Select value={inviteRole} onValueChange={(value: 'editor' | 'viewer') => setInviteRole(value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  size="sm"
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
