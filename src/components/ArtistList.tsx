import React, { useState, useMemo, useEffect, useRef } from 'react';
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

const STAGE_EMOJI: Record<string, string> = {
  'Airbnb':                  '🏠',
  'Allianz':                 '🛡️',
  'BMI':                     '🎼',
  'Bud Light':               '🍺',
  'Kidzapalooza':            '🧸',
  "Perry's":                 '🎧',
  "Tito's Handmade Vodka":   '🍸',
  'T-Mobile':                '📱',
};

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
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [hypeFilter, setHypeFilter] = useState<HypeLevel | 'all'>('all');
  const [activeStage, setActiveStage] = useState<string>('');
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Extract all unique stages in this active list
  const uniqueStages = useMemo(() => {
    const stages = new Set(artists.map(a => a.stage));
    return ['All', ...Array.from(stages).sort()];
  }, [artists]);

  // Extract all unique genres in this active list
  const uniqueGenres = useMemo(() => {
    const genres = new Set(artists.map(a => a.genre));
    return ['All', ...Array.from(genres).sort()];
  }, [artists]);

  // Filter artists based on user input, then sort by stage name then start time
  const filteredArtists = useMemo(() => {
    const filtered = artists.filter(artist => {
      // 1. Text Search Match
      const matchesSearch =
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.genre.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Stage Filter Match
      const matchesStage = selectedStage === 'All' || artist.stage === selectedStage;

      // 3. Active Friend's Hype Filter Match
      const activePref = groupPreferences[activeFriend.id]?.[artist.id] || 'none';
      const matchesHype = hypeFilter === 'all' || activePref === hypeFilter;

      // 4. Genre Filter Match
      const matchesGenre = selectedGenre === 'All' || artist.genre === selectedGenre;

      return matchesSearch && matchesStage && matchesHype && matchesGenre;
    });
    return [...filtered].sort((a, b) =>
      (a.stage || '').localeCompare(b.stage || '') || a.startMinutes - b.startMinutes
    );
  }, [artists, searchTerm, selectedStage, selectedGenre, hypeFilter, activeFriend.id, groupPreferences]);

  const uniqueFilteredStages = useMemo(
    () => [...new Set(filteredArtists.map(a => a.stage))],
    [filteredArtists]
  );

  // Seed active stage whenever the filtered list changes
  useEffect(() => {
    setActiveStage(uniqueFilteredStages[0] ?? '');
  }, [uniqueFilteredStages]);

  // Scrollspy: highlight active stage header closest to current scroll position
  useEffect(() => {
    let active = true;
    const handleScroll = () => {
      if (!active) return;
      
      const stageElements = Object.entries(stageRefs.current)
        .map(([stage, el]) => ({ stage, el }))
        .filter(item => item.el !== null) as { stage: string; el: HTMLDivElement }[];

      if (stageElements.length === 0) return;

      // Sort by offsetTop to guarantee chronological order
      stageElements.sort((a, b) => a.el.offsetTop - b.el.offsetTop);

      const isMobile = window.innerWidth <= 768;
      const buffer = isMobile ? 110 : 160;
      const scrollY = window.scrollY;
      
      let current = stageElements[0].stage;
      for (const { stage, el } of stageElements) {
        if (el.offsetTop - buffer <= scrollY) {
          current = stage;
        } else {
          break;
        }
      }
      setActiveStage(current);
    };

    const onScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    
    return () => {
      active = false;
      window.removeEventListener('scroll', onScroll);
    };
  }, [filteredArtists]);

  // Scroll to top of page when filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [selectedStage, selectedGenre, searchTerm, hypeFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Search & Filters Row */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="filter-controls-row">
          
          {/* Text Search */}
          <div className="filter-input-wrapper">
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
          <div className="filter-dropdown-wrapper">
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

          {/* Genre Dropdown */}
          <div className="filter-dropdown-wrapper">
            <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
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
              {uniqueGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hype Level Fast Filter */}
        <div className="hype-filter-row">
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

      {/* Stage Jump Nav */}
      {uniqueFilteredStages.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          position: 'sticky',
          top: 'var(--sticky-nav-top)',
          zIndex: 12,
          background: 'var(--bg-base)',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '12px',
          paddingBottom: '8px',
          marginTop: '-8px',
        }}>
          {uniqueFilteredStages.map(stage => (
            <button
              key={stage}
              onClick={() => {
                const el = stageRefs.current[stage];
                if (el) {
                  const isMobile = window.innerWidth <= 768;
                  const offset = isMobile ? 95 : 140;
                  const top = el.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
              }}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                borderRadius: '20px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                borderColor: activeStage === stage ? 'var(--neon-cyan)' : 'var(--border-light)',
                color: activeStage === stage ? 'var(--neon-cyan)' : 'var(--text-muted)',
                background: activeStage === stage ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
              }}
            >
              {STAGE_EMOJI[stage] ?? '🎵'} {stage}
            </button>
          ))}
        </div>
      )}

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
          filteredArtists.map((artist, index) => {
            const isNewStage = index === 0 || artist.stage !== filteredArtists[index - 1].stage;
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
              <React.Fragment key={artist.id}>
                {isNewStage && (
                  <div
                    ref={el => { stageRefs.current[artist.stage] = el; }}
                    data-stage={artist.stage}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginTop: index === 0 ? '0' : '32px',
                      marginBottom: '10px',
                      padding: '10px 16px',
                      background: 'rgba(6, 8, 20, 0.85)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 240, 255, 0.12)',
                      borderRadius: '10px',
                      position: 'sticky',
                      top: 'var(--sticky-separator-top)',
                      zIndex: 10,
                    }}>
                    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>
                      {STAGE_EMOJI[artist.stage] ?? '🎵'}
                    </span>
                    <span style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--neon-cyan)',
                      fontFamily: 'var(--font-display)',
                    }}>
                      {artist.stage}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(0, 240, 255, 0.15)' }} />
                  </div>
                )}
              <div className="artist-card">
                
                {/* Time & Stage Info */}
                <div className="artist-time-stage">
                  <span className="artist-time">
                    {formatTimeStr(artist.startTime)} - {formatTimeStr(artist.endTime)}
                  </span>
                  <span className="artist-stage">
                    {STAGE_EMOJI[artist.stage] ?? '📍'} {artist.stage}
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
              </React.Fragment>
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
