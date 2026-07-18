import React, { useState, useEffect } from 'react';
import { Friend, GroupPreferences, HypeLevel } from './types';
import { MOCK_ARTISTS, DEFAULT_FRIENDS } from './mockData';
import { FriendSettings } from './components/FriendSettings';
import { ArtistList } from './components/ArtistList';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { Users, Calendar, Sparkles, MapPin } from 'lucide-react';

const LOCAL_STORAGE_KEY_FRIENDS = 'lollasync_friends_v1';
const LOCAL_STORAGE_KEY_PREFS = 'lollasync_prefs_v1';

// Seed initial preferences to make the application immediately interesting on first load!
const getSeededPreferences = (): GroupPreferences => {
  return {
    me: {
      'th-johnsummit': 'must',
      'th-empire-of-the-sun': 'want',
      'th-teddy': 'maybe',
      'th-between-friends': 'want',
      'fr-charlixcx': 'must',
      'fr-zaralarsson': 'want',
      'fr-yungblud': 'must',
      'sa-jennie': 'must',
      'sa-etheland': 'want',
      'sa-hippocampus': 'maybe',
      'su-thexx': 'must',
      'su-yoasobi': 'must',
      'su-beabadoobee': 'want'
    },
    alice: {
      'th-johnsummit': 'must',
      'th-wetleg': 'want',
      'th-teddy': 'must',
      'fr-smashingpumpkins': 'must',
      'fr-liluzivert': 'must',
      'fr-sukiwaterhouse': 'want',
      'sa-oliviadean': 'must',
      'sa-etheland': 'must',
      'sa-deftones': 'maybe',
      'su-tatemcrae': 'must',
      'su-yoasobi': 'must',
      'su-aespa': 'want'
    },
    bob: {
      'th-lorde': 'must',
      'th-empire-of-the-sun': 'must',
      'th-teddy': 'want',
      'fr-majorlazer': 'must',
      'fr-zaralarsson': 'want',
      'fr-nettspend': 'must',
      'sa-discolines': 'must',
      'sa-killermike': 'must',
      'sa-fourtet': 'want',
      'su-chainsmokers': 'must',
      'su-turnstile': 'want',
      'su-hotmulligan': 'must'
    },
    charlie: {
      'th-fisher': 'must',
      'th-wetleg': 'must',
      'th-flo': 'want',
      'fr-majorlazer': 'want',
      'fr-slayyyter': 'must',
      'fr-oklou': 'must',
      'sa-discolines': 'must',
      'sa-tvgirl': 'must',
      'sa-fourtet': 'must',
      'su-chainsmokers': 'want',
      'su-dukedumont': 'must',
      'su-yoasobi': 'want'
    }
  };
};

const App: React.FC = () => {
  // --- STATE ---
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FRIENDS);
    return saved ? JSON.parse(saved) : DEFAULT_FRIENDS;
  });

  const [groupPreferences, setGroupPreferences] = useState<GroupPreferences>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFS);
    return saved ? JSON.parse(saved) : getSeededPreferences();
  });

  const [activeFriendId, setActiveFriendId] = useState<string>('me');
  const [activeDay, setActiveDay] = useState<'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Thursday');
  const [viewMode, setViewMode] = useState<'lineup' | 'personal' | 'squad'>('lineup');

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_FRIENDS, JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFS, JSON.stringify(groupPreferences));
  }, [groupPreferences]);

  // --- ACTIONS ---
  const handleSetPreference = (friendId: string, artistId: string, level: HypeLevel) => {
    setGroupPreferences(prev => {
      const userPrefs = prev[friendId] ? { ...prev[friendId] } : {};
      
      if (level === 'none') {
        delete userPrefs[artistId];
      } else {
        userPrefs[artistId] = level;
      }

      return {
        ...prev,
        [friendId]: userPrefs
      };
    });
  };

  const handleAddFriend = (name: string, color: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    // Generate initials (up to 2 chars)
    const initials = cleanName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newId = cleanName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();

    const newFriend: Friend = {
      id: newId,
      name: cleanName,
      color,
      avatar: initials || cleanName[0].toUpperCase()
    };

    setFriends(prev => [...prev, newFriend]);
    setActiveFriendId(newId);
  };

  const handleRemoveFriend = (id: string) => {
    if (id === 'me') return; // Cannot delete oneself
    
    setFriends(prev => prev.filter(f => f.id !== id));
    setGroupPreferences(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    if (activeFriendId === id) {
      setActiveFriendId('me');
    }
  };

  // Filter artists by the selected day
  const filteredArtists = React.useMemo(() => {
    return MOCK_ARTISTS.filter(a => a.day === activeDay);
  }, [activeDay]);

  const activeFriend = friends.find(f => f.id === activeFriendId) || friends[0];

  return (
    <div className="app-container">
      
      {/* Header Panel */}
      <header className="glass-panel app-header">
        <div className="brand">
          <span className="brand-icon">🎸</span>
          <div>
            <h1 className="brand-title">LollaSync</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Schedule Optimizer & Group Coordinator
            </span>
          </div>
        </div>

        <nav className="nav-controls">
          <button 
            className={`btn ${viewMode === 'lineup' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('lineup')}
          >
            <Calendar size={16} />
            <span>1. Preference Setup</span>
          </button>
          
          <button 
            className={`btn ${viewMode === 'personal' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('personal')}
          >
            <Sparkles size={16} />
            <span>2. Personal Itinerary</span>
          </button>
          
          <button 
            className={`btn ${viewMode === 'squad' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('squad')}
          >
            <Users size={16} />
            <span>3. Squad Sync</span>
          </button>
        </nav>
      </header>

      {/* Main Layout Grid */}
      <main className="dashboard-grid">
        
        {/* Sidebar Controls */}
        <section className="sidebar">
          
          {/* Friend Switcher & Config */}
          <FriendSettings
            friends={friends}
            activeFriendId={activeFriendId}
            setActiveFriendId={setActiveFriendId}
            onAddFriend={handleAddFriend}
            onRemoveFriend={handleRemoveFriend}
          />

          {/* Quick Festival Info / Tip Card */}
          <div className="glass-panel" style={{ padding: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <h4 style={{ color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-display)' }}>
              <MapPin size={16} style={{ color: 'var(--neon-yellow)' }} />
              Grant Park Walk Times
            </h4>
            <p style={{ marginBottom: '8px', lineHeight: '1.4' }}>
              Walking between <strong>T-Mobile (South)</strong> and <strong>Bud Light (North)</strong> takes about <strong>15 minutes</strong> through heavy festival crowds.
            </p>
            <p style={{ lineHeight: '1.4' }}>
              LollaSync alerts you if you schedule back-to-back shows on opposite ends of the park!
            </p>
          </div>
        </section>

        {/* Main Workspace */}
        <section className="main-panel">
          
          {/* Day Navigation Tabs */}
          <div className="day-tabs">
            {(['Thursday', 'Friday', 'Saturday', 'Sunday'] as const).map(day => (
              <button
                key={day}
                className={`day-tab ${activeDay === day ? 'active' : ''}`}
                onClick={() => setActiveDay(day)}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Core Content Switcher */}
          {viewMode === 'lineup' && (
            <ArtistList
              artists={filteredArtists}
              activeFriend={activeFriend}
              friends={friends}
              groupPreferences={groupPreferences}
              onSetPreference={handleSetPreference}
            />
          )}

          {viewMode === 'personal' && (
            <ScheduleTimeline
              artists={filteredArtists}
              friends={friends}
              activeFriendId={activeFriendId}
              groupPreferences={groupPreferences}
              viewMode="personal"
            />
          )}

          {viewMode === 'squad' && (
            <ScheduleTimeline
              artists={filteredArtists}
              friends={friends}
              activeFriendId={activeFriendId}
              groupPreferences={groupPreferences}
              viewMode="squad"
            />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', paddingTop: '40px', paddingBottom: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <p>LollaSync &copy; 2026. Designed for festival squad coordination. Optimize responsibly!</p>
      </footer>
    </div>
  );
};

export default App;
