import React, { useState } from 'react';
import { Friend } from '../types';
import { Users, UserPlus, Trash2 } from 'lucide-react';

interface FriendSettingsProps {
  friends: Friend[];
  activeFriendId: string;
  setActiveFriendId: (id: string) => void;
  onAddFriend: (name: string, color: string) => void;
  onRemoveFriend: (id: string) => void;
  myFriendId: string | null;
}

const PRESET_COLORS = [
  '#FF007F', // Neon Pink
  '#00F0FF', // Neon Cyan
  '#FFD700', // Neon Gold/Yellow
  '#39FF14', // Neon Green
  '#FF6B35', // Neon Orange
  '#BD00FF', // Neon Purple
  '#FF003C', // Crimson Neon
  '#00FFAB'  // Neon Mint
];

export const FriendSettings: React.FC<FriendSettingsProps> = ({
  friends,
  activeFriendId,
  setActiveFriendId,
  onAddFriend,
  onRemoveFriend,
  myFriendId
}) => {
  const [newFriendName, setNewFriendName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[4]); // default to orange or next available

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    onAddFriend(newFriendName.trim(), selectedColor);
    setNewFriendName('');
    // Pick another color for next time
    const nextColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
    setSelectedColor(nextColor);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
        <Users size={20} style={{ color: 'var(--neon-pink)' }} />
        Friend Group Setup
      </h3>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Select a profile below to customize their lineup preferences, or add your squad members.
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

              {friend.id !== 'me' && friend.id === myFriendId && (
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

      <form onSubmit={handleSubmit} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Add Squad Member
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="Friend's name..."
              maxLength={15}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '8px 12px', borderRadius: '8px' }}
            >
              <UserPlus size={18} />
            </button>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Choose Badge Color
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: selectedColor === color ? '2px solid #fff' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: selectedColor === color ? `0 0 10px ${color}` : `0 0 4px ${color}40`,
                    transition: 'transform var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
