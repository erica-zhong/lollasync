import React from 'react';
import { Friend } from '../types';
import { Users, Trash2 } from 'lucide-react';

interface FriendSettingsProps {
  friends: Friend[];
  activeFriendId: string;
  setActiveFriendId: (id: string) => void;
  onRemoveFriend: (id: string) => void;
  myFriendId: string | null;
  isAdmin?: boolean;
}

export const FriendSettings: React.FC<FriendSettingsProps> = ({
  friends,
  activeFriendId,
  setActiveFriendId,
  onRemoveFriend,
  myFriendId,
  isAdmin = false
}) => {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
        <Users size={20} style={{ color: 'var(--neon-pink)' }} />
        Friend Group Setup
      </h3>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Select a profile below to customize their lineup preferences, or view your friends' schedules.
      </p>

      <div className="friend-pill-list">
        {friends.map((friend) => {
          const isActive = friend.id === activeFriendId;
          return (
            <div
              key={friend.id}
              className={`friend-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActiveFriendId(friend.id)}
              style={{
                borderColor: isActive ? friend.color : 'var(--border-light)',
                boxShadow: isActive ? `0 0 12px ${friend.color}30` : 'none'
              }}
            >
              <div className="friend-info">
                <div
                  className="friend-avatar"
                  style={{
                    backgroundColor: friend.color,
                    boxShadow: `0 0 8px ${friend.color}40`
                  }}
                >
                  {friend.avatar}
                </div>
                <span className="friend-name" style={{ color: isActive ? '#fff' : 'var(--text-secondary)' }}>
                  {friend.name}
                </span>
              </div>

              {(friend.id !== 'me' || friends.length > 1) && (friend.id === myFriendId || isAdmin) && (
                <button
                  className="trash-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFriend(friend.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--neon-pink)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
