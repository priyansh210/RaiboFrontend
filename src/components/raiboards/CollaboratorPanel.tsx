import React, { useState } from 'react';
import { RaiBoardCollaborator, RaiBoardInvite } from '@/models/internal/RaiBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Mail, Crown, Edit, Eye, Trash2 } from 'lucide-react';

interface CollaboratorPanelProps {
  collaborators: RaiBoardCollaborator[];
  onInviteCollaborator: (email: string, role: 'editor' | 'viewer') => void;
  userRole: 'owner' | 'editor' | 'viewer';
  isOpen: boolean;
  onToggle: () => void;
}

export const CollaboratorPanel: React.FC<CollaboratorPanelProps> = ({
  collaborators,
  onInviteCollaborator,
  userRole,
  isOpen,
  onToggle,
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="font-medium">Collaborators</span>
          <Badge variant="secondary">{collaborators.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          ×
        </Button>
      </div>

      {/* Collaborators List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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

      {/* Invite Section */}
      {canInvite && (
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <UserPlus className="w-4 h-4" />
            Invite Collaborator
          </div>
          
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
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
