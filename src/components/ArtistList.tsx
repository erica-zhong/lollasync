import React, { useState, useMemo } from 'react';
import { Artist, Friend, GroupPreferences, HypeLevel } from '../types';
import { formatTimeStr } from '../mockData';
import { Search, Flame, Star, Coffee, EyeOff, SlidersHorizontal } from 'lucide-react';

interface ArtistListProps {
  artists: Artist[];
  activeFriend: Friend;
  friends: Friend[];
  groupPreferences: GroupPreferences;
  onSetPreference: (friendId: string, artistId: string, level: HypeLevel) => void;
  myFriendId: string | null;
}

export const ArtistList: React.FC<ArtistListProps> = ({
  artists,
  activeFriend,
  friends,
  groupPreferences,
  onSetPreference,
  myFriendId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [hypeFilter, setHypeFilter] = useState<HypeLevel | 'all'>('all');

  // Extract all unique stages in this active list
  const uniqueStages = useMemo(() => {
    const stages = new Set(artists.map(a => a.stage));
    return ['All', ...Array.from(stages).sort()];
  }, [artists]);

  // Filter artists based on user input
  const filteredArtists = useMemo(() => {
    return artists.filter(artist => {
      // 1. Text Search Match
      const matchesSearch = 
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.genre.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Stage Filter Match
      const matchesStage = selectedStage === 'All' || artist.stage === selectedStage;

      // 3. Active Friend's Hype Filter Match
      const activePref = groupPreferences[activeFriend.id]?.[artist.id] || 'none';
      const matchesHype = hypeFilter === 'all' || activePref === hypeFilter;

      return matchesSearch && matchesStage && matchesHype;
    });
  }, [artists, searchTerm, selectedStage, hypeFilter, activeFriend.id, groupPreferences]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Search & Filters Row */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Text Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search artist or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '10px 12px 10px 38px',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Stage Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px' }}>
            <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(13, 16, 37, 0.9)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '10px',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {uniqueStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hype Level Fast Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Selections:</span>
          <button
            onClick={() => setHypeFilter('all')}
            className={`btn ${hypeFilter === 'all' ? 'btn-active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px' }}
          >
            All Lineup
          </button>
          <button
            onClick={() => setHypeFilter('must')}
            className={`btn ${hypeFilter === 'must' ? 'btn-active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', borderColor: 'var(--neon-pink)' }}
          >
            🔥 Must Sees
          </button>
          <button
            onClick={() => setHypeFilter('want')}
            className={`btn ${hypeFilter === 'want' ? 'btn-active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', borderColor: 'var(--neon-cyan)' }}
          >
            ⭐ Want to See
          </button>
        </div>
      </div>

      {/* Selected Friend Status Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', background: 'rgba(255, 255, 255, 0.02)', padding: '10px 16px', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {activeFriend.id === myFriendId ? 'Setting preferences for:' : 'Viewing preferences for:'}
          </span>
          <span 
            style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: activeFriend.color, 
              background: `${activeFriend.color}15`, 
              padding: '2px 8px', 
              borderRadius: '4px',
              border: `1px solid ${activeFriend.color}40`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activeFriend.color }} />
            {activeFriend.name}
          </span>
        </div>

        {activeFriend.id !== myFriendId && (
          <span 
            style={{ 
              fontSize: '0.75rem', 
              color: 'var(--neon-yellow)', 
              background: 'rgba(255, 223, 0, 0.1)', 
              padding: '4px 10px', 
              borderRadius: '6px', 
              border: '1px solid rgba(255, 223, 0, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase'
            }}
            title="Only this user can edit their own schedule"
          >
            🔒 Read-Only
          </span>
        )}
      </div>

      {/* Artist Cards Container */}
      <div className="artist-list">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => {
            const activePref = groupPreferences[activeFriend.id]?.[artist.id] || 'none';

            // Find other friends who have preference for this artist
            const otherFriendPreferences = friends
              .filter(f => f.id !== activeFriend.id)
              .map(f => {
                const pref = groupPreferences[f.id]?.[artist.id] || 'none';
                return { friend: f, pref };
              })
              .filter(item => item.pref !== 'none');

            return (
              <div key={artist.id} className="artist-card">
                
                {/* Time & Stage Info */}
                <div className="artist-time-stage">
                  <span className="artist-time">
                    {formatTimeStr(artist.startTime)} - {formatTimeStr(artist.endTime)}
                  </span>
                  <span className="artist-stage">
                    📍 {artist.stage}
                  </span>
                </div>

                {/* Artist Name & Genre & Overlap Info */}
                <div className="artist-details">
                  <span className="artist-name">{artist.name}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
                    <span className="artist-genre-tag">{artist.genre}</span>
                    
                    {/* Display other friends selected statuses */}
                    {otherFriendPreferences.length > 0 && (
                      <div className="card-friends-list">
                        {otherFriendPreferences.map(({ friend, pref }) => (
                          <span
                            key={friend.id}
                            className={`card-friend-badge ${pref}`}
                            title={`${friend.name} rating: ${pref === 'must' ? 'Must See' : pref === 'want' ? 'Would Like to See' : 'If Convenient'}`}
                            style={{
                              backgroundColor: `${friend.color}25`,
                              color: friend.color,
                              border: `1px solid ${friend.color}40`
                            }}
                          >
                            {friend.avatar} {pref === 'must' ? '🔥' : pref === 'want' ? '⭐' : '💤'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hype Selectors for Active Friend */}
                {activeFriend.id === myFriendId ? (
                  <div className="hype-selector">
                    <button
                      onClick={() => onSetPreference(activeFriend.id, artist.id, activePref === 'must' ? 'none' : 'must')}
                      className={`hype-btn ${activePref === 'must' ? 'active-must' : ''}`}
                      title="Must See"
                    >
                      <Flame size={14} />
                      <span>Must</span>
                    </button>
                    <button
                      onClick={() => onSetPreference(activeFriend.id, artist.id, activePref === 'want' ? 'none' : 'want')}
                      className={`hype-btn ${activePref === 'want' ? 'active-want' : ''}`}
                      title="Would Like to See"
                    >
                      <Star size={14} />
                      <span>Want</span>
                    </button>
                    <button
                      onClick={() => onSetPreference(activeFriend.id, artist.id, activePref === 'maybe' ? 'none' : 'maybe')}
                      className={`hype-btn ${activePref === 'maybe' ? 'active-maybe' : ''}`}
                      title="If Convenient"
                    >
                      <Coffee size={14} />
                      <span>Maybe</span>
                    </button>
                    <button
                      onClick={() => onSetPreference(activeFriend.id, artist.id, activePref === 'none' ? 'none' : 'none')}
                      className={`hype-btn ${activePref === 'none' ? 'active-none' : ''}`}
                      title="Not Interested"
                    >
                      <EyeOff size={14} />
                      <span>Skip</span>
                    </button>
                  </div>
                ) : (
                  <div className="hype-selector" style={{ pointerEvents: 'none' }}>
                    {activePref === 'must' && (
                      <span className="read-only-badge must">
                        <Flame size={14} />
                        <span>Must See</span>
                      </span>
                    )}
                    {activePref === 'want' && (
                      <span className="read-only-badge want">
                        <Star size={14} />
                        <span>Want to See</span>
                      </span>
                    )}
                    {activePref === 'maybe' && (
                      <span className="read-only-badge maybe">
                        <Coffee size={14} />
                        <span>Maybe</span>
                      </span>
                    )}
                    {activePref === 'none' && (
                      <span className="read-only-badge none">
                        <EyeOff size={14} />
                        <span>Skipping</span>
                      </span>
                    )}
                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: '12px' }}>
            No artists found matching the filter criteria. Try adjusting your search term or stage selection.
          </div>
        )}
      </div>
    </div>
  );
};
