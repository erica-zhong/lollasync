import React, { useState, useEffect, useRef } from 'react';
import { Friend, GroupPreferences, HypeLevel } from './types';
import { MOCK_ARTISTS, DEFAULT_FRIENDS } from './mockData';
import { FriendSettings } from './components/FriendSettings';
import { ArtistList } from './components/ArtistList';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { Users, Calendar, Sparkles, MapPin } from 'lucide-react';

const LOCAL_STORAGE_KEY_FRIENDS = 'lollasync_friends_v2';
const LOCAL_STORAGE_KEY_PREFS = 'lollasync_prefs_v2';

// Seed initial preferences (now cleared to start fresh!)
const getSeededPreferences = (): GroupPreferences => {
  return {};
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

  const [myFriendId, setMyFriendId] = useState<string | null>(() => {
    return localStorage.getItem('lollasync_my_friend_id');
  });
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    return !localStorage.getItem('lollasync_my_friend_id');
  });

  const [activeFriendId, setActiveFriendId] = useState<string>(() => {
    return localStorage.getItem('lollasync_my_friend_id') || 'me';
  });
  const [activeDay, setActiveDay] = useState<'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Thursday');
  const [viewMode, setViewMode] = useState<'lineup' | 'personal' | 'squad'>('squad');

  // --- OVERRIDES FOR CONFLICTION RESOLUTIONS ---
  const [overrides, setOverrides] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('lollasync_overrides_v2');
    return saved ? JSON.parse(saved) : {};
  });

  // --- SPLITS FOR OVERLAPPING SETS ---
  const [splits, setSplits] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('lollasync_splits_v2');
    return saved ? JSON.parse(saved) : {};
  });

  // --- GOOGLE SHEETS LIVE SYNC STATE ---
  const [sheetsUrl, setSheetsUrl] = useState<string>(() => {
    const saved = localStorage.getItem('lollasync_sheets_url');
    return saved || 'https://script.google.com/macros/s/AKfycbyk0Qy6A-SnzuADe2sQhqh8bArcOwJq2oGvo19i8wSNPp8c96BT_JlakC5zKrr5yIQl/exec';
  });
  const [syncEnabled, setSyncEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('lollasync_sheets_enabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [lastSyncStatus, setLastSyncStatus] = useState<string>('Disconnected');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);



  // Refs to prevent stale closures in async polling fetch
  const friendsRef = useRef(friends);
  const myFriendIdRef = useRef(myFriendId);
  const groupPreferencesRef = useRef(groupPreferences);
  const overridesRef = useRef(overrides);
  const splitsRef = useRef(splits);
  const lastSaveTimeRef = useRef<number>(0);

  useEffect(() => {
    friendsRef.current = friends;
    myFriendIdRef.current = myFriendId;
    groupPreferencesRef.current = groupPreferences;
    overridesRef.current = overrides;
    splitsRef.current = splits;
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_FRIENDS, JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFS, JSON.stringify(groupPreferences));
  }, [groupPreferences]);

  useEffect(() => {
    localStorage.setItem('lollasync_overrides_v2', JSON.stringify(overrides));
  }, [overrides]);

  useEffect(() => {
    localStorage.setItem('lollasync_splits_v2', JSON.stringify(splits));
  }, [splits]);

  useEffect(() => {
    localStorage.setItem('lollasync_sheets_url', sheetsUrl);
  }, [sheetsUrl]);

  useEffect(() => {
    localStorage.setItem('lollasync_sheets_enabled', JSON.stringify(syncEnabled));
  }, [syncEnabled]);

  // --- SELF-HEALING RECOVERY EFFECT ---
  useEffect(() => {
    if (myFriendId && friends.length > 0) {
      const hasSelf = friends.some(f => f.id === myFriendId);
      if (!hasSelf) {
        setMyFriendId(null);
        localStorage.removeItem('lollasync_my_friend_id');
        setShowWelcomeModal(true);
      }
    } else if (friends.length === 0 && !showWelcomeModal) {
      setMyFriendId(null);
      localStorage.removeItem('lollasync_my_friend_id');
      setShowWelcomeModal(true);
    }
  }, [friends, myFriendId, showWelcomeModal]);
  const fetchFromSheets = async (url: string) => {
    if (!url) return;
    if (Date.now() - lastSaveTimeRef.current < 8000) {
      setLastSyncStatus('Success (Sync Protected)');
      return;
    }
    setLastSyncStatus('Syncing...');
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      
      if (data.friends && data.groupPreferences) {
        // Read latest states from refs
        const currentFriends = friendsRef.current;
        const currentPrefs = groupPreferencesRef.current;
        const currentSplits = splitsRef.current;
        const currentMyFriendId = myFriendIdRef.current;

        // Prevent race condition: ensure our own profile is never lost/deleted by incoming sync
        let mergedFriends = [...data.friends];
        if (currentMyFriendId) {
          const hasSelf = data.friends.some((f: Friend) => f.id === currentMyFriendId);
          if (!hasSelf) {
            const localSelf = currentFriends.find(f => f.id === currentMyFriendId);
            if (localSelf) {
              mergedFriends.push(localSelf);
            }
          }
        }

        const friendsStr = JSON.stringify(mergedFriends);
        const currentFriendsStr = JSON.stringify(currentFriends);
        const prefsStr = JSON.stringify(data.groupPreferences);
        const currentPrefsStr = JSON.stringify(currentPrefs);
        
        if (friendsStr !== currentFriendsStr) {
          setFriends(mergedFriends);
        }
        if (prefsStr !== currentPrefsStr) {
          setGroupPreferences(data.groupPreferences);
        }

        // NOTE: overrides are personal/local only - not synced from sheets
        // Merge incoming overrides: accept other friends' overrides from sheets,
        // but NEVER overwrite myFriendId's own overrides (local is authoritative for self)
        if (data.overrides) {
          const localOverrides = overridesRef.current;
          const mergedOverrides = { ...data.overrides };
          if (currentMyFriendId && localOverrides[currentMyFriendId]) {
            // Keep our own swaps regardless of what sheets says
            mergedOverrides[currentMyFriendId] = localOverrides[currentMyFriendId];
          }
          const overridesStr = JSON.stringify(mergedOverrides);
          const currentOverridesStr = JSON.stringify(localOverrides);
          if (overridesStr !== currentOverridesStr) {
            setOverrides(mergedOverrides);
          }
        }

        if (data.splits) {
          const splitsStr = JSON.stringify(data.splits);
          const currentSplitsStr = JSON.stringify(currentSplits);
          if (splitsStr !== currentSplitsStr) {
            setSplits(data.splits);
          }
        }
        
        setLastSyncStatus('Success');
        const now = new Date();
        setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        setLastSyncStatus('Success (Empty)');
      }
    } catch (err) {
      console.error('Error syncing from Google Sheets:', err);
      setLastSyncStatus('Error');
    }
  };

  const saveStateToSheets = (
    url: string, 
    updatedFriends: Friend[], 
    updatedPrefs: GroupPreferences,
    updatedOverrides: Record<string, string[]>,
    updatedSplits: Record<string, string[]>
  ) => {
    if (!url) return;
    lastSaveTimeRef.current = Date.now();
    setIsSaving(true);
    setLastSyncStatus('Saving...');
    fetch(url, {
      method: 'POST',
      mode: 'no-cors', // Avoids CORS redirects blockages from Google script response
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        friends: updatedFriends,
        groupPreferences: updatedPrefs,
        overrides: updatedOverrides,
        splits: updatedSplits
      })
    })
    .then(() => {
      setIsSaving(false);
      setLastSyncStatus('Success');
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    })
    .catch((err) => {
      setIsSaving(false);
      console.error('Error saving to Google Sheets:', err);
      setLastSyncStatus('Error');
    });
  };

  // Polling hook to sync from Google Sheets periodically
  useEffect(() => {
    if (!sheetsUrl || !syncEnabled) return;

    fetchFromSheets(sheetsUrl);

    const interval = setInterval(() => {
      fetchFromSheets(sheetsUrl);
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [sheetsUrl, syncEnabled]);

  // Scroll to top of page when main tabs or active profiles change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [viewMode, activeFriendId]);

  // --- ACTIONS ---
  const handleSetPreference = (friendId: string, artistId: string, level: HypeLevel) => {
    setGroupPreferences(prev => {
      const userPrefs = prev[friendId] ? { ...prev[friendId] } : {};
      
      if (level === 'none') {
        delete userPrefs[artistId];
      } else {
        userPrefs[artistId] = level;
      }

      const updated = {
        ...prev,
        [friendId]: userPrefs
      };

      if (sheetsUrl && syncEnabled) {
        saveStateToSheets(sheetsUrl, friends, updated, overrides, splits);
      }

      return updated;
    });
  };



  const handleRemoveFriend = (id: string) => {
    if (id === 'me') return;
    
    const updatedFriends = friends.filter(f => f.id !== id);
    setFriends(updatedFriends);
    
    setGroupPreferences(prev => {
      const updatedPrefs = { ...prev };
      delete updatedPrefs[id];
      const updatedOverrides = { ...overrides };
      delete updatedOverrides[id];
      setOverrides(updatedOverrides);

      const updatedSplits = { ...splits };
      delete updatedSplits[id];
      setSplits(updatedSplits);

      if (sheetsUrl && syncEnabled) {
        saveStateToSheets(sheetsUrl, updatedFriends, updatedPrefs, updatedOverrides, updatedSplits);
      }

      return updatedPrefs;
    });

    if (activeFriendId === id) {
      setActiveFriendId('me');
    }
  };

  const handleToggleOverride = (friendId: string, artistId: string) => {
    const friendOverrides = overrides[friendId] ? [...overrides[friendId]] : [];
    const index = friendOverrides.indexOf(artistId);
    if (index > -1) {
      friendOverrides.splice(index, 1);
    } else {
      friendOverrides.push(artistId);
    }
    const updated = { ...overrides, [friendId]: friendOverrides };
    setOverrides(updated);
    if (sheetsUrl && syncEnabled) {
      saveStateToSheets(sheetsUrl, friends, groupPreferences, updated, splits);
    }
  };

  const handleToggleSplit = (friendId: string, artist1Id: string, artist2Id?: string) => {
    setSplits(prev => {
      const friendSplits = prev[friendId] ? [...prev[friendId]] : [];
      
      if (!artist2Id) {
        const f = friendSplits.filter(id => id !== artist1Id);
        if (sheetsUrl && syncEnabled) {
          saveStateToSheets(sheetsUrl, friends, groupPreferences, overrides, { ...prev, [friendId]: f });
        }
        return { ...prev, [friendId]: f };
      }

      const contains1 = friendSplits.includes(artist1Id);
      const contains2 = friendSplits.includes(artist2Id);

      if (contains1 && contains2) {
        const f = friendSplits.filter(id => id !== artist1Id && id !== artist2Id);
        if (sheetsUrl && syncEnabled) {
          saveStateToSheets(sheetsUrl, friends, groupPreferences, overrides, { ...prev, [friendId]: f });
        }
        return { ...prev, [friendId]: f };
      } else {
        const f = Array.from(new Set([...friendSplits, artist1Id, artist2Id]));
        if (sheetsUrl && syncEnabled) {
          saveStateToSheets(sheetsUrl, friends, groupPreferences, overrides, { ...prev, [friendId]: f });
        }
        return { ...prev, [friendId]: f };
      }
    });
  };

  const handleResetAllData = async () => {
    const confirmWipe = window.confirm(
      "WARNING: This will completely WIPE the Google Sheet database and reset your local schedule. This action cannot be undone. Are you sure?"
    );
    if (!confirmWipe) return;

    if (sheetsUrl && syncEnabled) {
      setLastSyncStatus('Wiping...');
      try {
        await fetch(sheetsUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            friends: [],
            groupPreferences: {},
            overrides: {},
            splits: {}
          })
        });
      } catch (err) {
        console.error('Failed to wipe Google Sheet database:', err);
      }
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY_FRIENDS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFS);
    localStorage.removeItem('lollasync_overrides_v2');
    localStorage.removeItem('lollasync_splits_v2');
    localStorage.removeItem('lollasync_my_friend_id');

    window.location.reload();
  };

  // Filter artists by the selected day
  const filteredArtists = React.useMemo(() => {
    return MOCK_ARTISTS.filter(a => a.day === activeDay);
  }, [activeDay]);

  const currentMeFriend = friends.find(f => f.id === myFriendId);
  const isAdmin = currentMeFriend?.name.toLowerCase() === 'erica';
  const activeFriend = friends.find(f => f.id === activeFriendId) || friends[0] || DEFAULT_FRIENDS[0];

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
            <span>Setup</span>
          </button>
          
          <button 
            className={`btn ${viewMode === 'personal' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('personal')}
          >
            <Sparkles size={16} />
            <span>Itinerary</span>
          </button>
          
          <button 
            className={`btn ${viewMode === 'squad' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('squad')}
          >
            <Users size={16} />
            <span>Squad Sync</span>
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
            onRemoveFriend={handleRemoveFriend}
            myFriendId={myFriendId}
            isAdmin={isAdmin}
          />


          {/* Google Sheets Live Sync Panel */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)' }}>
              <span style={{ fontSize: '1.2rem' }}>📊</span>
              Google Sheets Live Sync
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isAdmin ? (
                <>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Web App URL
                    </label>
                    <input
                      type="text"
                      value={sheetsUrl}
                      onChange={(e) => setSheetsUrl(e.target.value)}
                      placeholder="Paste script URL..."
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-body)'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Live Auto-Sync (10s):
                    </span>
                    <button
                      onClick={() => setSyncEnabled(!syncEnabled)}
                      className="btn"
                      style={{ 
                        padding: '4px 10px', 
                        fontSize: '0.75rem', 
                        borderRadius: '6px',
                        borderColor: syncEnabled ? 'var(--neon-cyan)' : 'var(--border-light)',
                        color: syncEnabled ? 'var(--neon-cyan)' : 'var(--text-muted)',
                        background: syncEnabled ? 'rgba(0, 242, 254, 0.05)' : 'none'
                      }}
                    >
                      {syncEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '4px' }}>
                    <button
                      onClick={() => fetchFromSheets(sheetsUrl)}
                      disabled={!sheetsUrl || lastSyncStatus === 'Syncing...'}
                      className="btn"
                      style={{ flex: 1, padding: '8px', fontSize: '0.75rem', justifyContent: 'center' }}
                    >
                      Sync Now 🔄
                    </button>
                    <button
                      onClick={handleResetAllData}
                      className="btn"
                      style={{ 
                        flex: 1, 
                        padding: '8px', 
                        fontSize: '0.75rem', 
                        justifyContent: 'center',
                        borderColor: 'var(--neon-pink)',
                        color: 'var(--neon-pink)',
                        background: 'rgba(255, 0, 127, 0.05)',
                        marginTop: '4px'
                      }}
                    >
                      Wipe Database & Reset App 🚨
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Database Connection:</span>
                    <span style={{ 
                      color: syncEnabled && sheetsUrl ? 'var(--neon-green)' : 'var(--text-muted)', 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {syncEnabled && sheetsUrl ? '● Connected' : '○ Offline'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.3' }}>
                    Your selections auto-save and sync with the squad in real-time.
                  </p>
                </div>
              )}

              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '8px', marginTop: '4px' }}>
                Sync Status: <strong style={{ color: lastSyncStatus === 'Success' ? 'var(--neon-cyan)' : lastSyncStatus === 'Error' ? 'var(--neon-pink)' : 'var(--neon-yellow)' }}>{lastSyncStatus}</strong>
                {lastSyncTime && ` (${lastSyncTime})`}
              </div>
            </div>
          </div>

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
              myFriendId={myFriendId}
            />
          )}

          {viewMode === 'personal' && (
                      <ScheduleTimeline
              artists={filteredArtists}
              friends={friends}
              activeFriendId={activeFriendId}
              groupPreferences={groupPreferences}
              viewMode="personal"
              overrides={overrides}
              onToggleOverride={handleToggleOverride}
              splits={splits}
              onToggleSplit={handleToggleSplit}
              myFriendId={myFriendId}
              isSaving={isSaving}
            />
          )}

          {viewMode === 'squad' && (
                      <ScheduleTimeline
              artists={filteredArtists}
              friends={friends}
              activeFriendId={activeFriendId}
              groupPreferences={groupPreferences}
              viewMode="squad"
              overrides={overrides}
              onToggleOverride={handleToggleOverride}
              splits={splits}
              onToggleSplit={handleToggleSplit}
              myFriendId={myFriendId}
              isSaving={isSaving}
            />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', paddingTop: '40px', paddingBottom: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <p>LollaSync &copy; 2026. Designed for festival squad coordination. Optimize responsibly!</p>
      </footer>
      {/* Welcome Modal Overlay */}
      {showWelcomeModal && (
        <div className="welcome-modal-overlay">
          <div className="glass-panel welcome-modal">
            <span style={{ fontSize: '3.5rem' }}>🎸</span>
            <h2 className="brand-title" style={{ fontSize: '1.8rem', margin: '12px 0 6px 0', textTransform: 'none', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome to LollaSync!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center', maxWidth: '340px', lineHeight: '1.4' }}>
              Enter your name to connect with the squad and lock in your Lollapalooza schedule.
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const nameInput = form.elements.namedItem('username') as HTMLInputElement;
              const name = nameInput.value.trim();
              if (!name) return;

              // Check if a friend with this name already exists (case-insensitive)
              const existingFriend = friends.find(f => f.name.toLowerCase() === name.toLowerCase());
              
              if (existingFriend) {
                // Associate with existing friend profile
                setMyFriendId(existingFriend.id);
                localStorage.setItem('lollasync_my_friend_id', existingFriend.id);
                setActiveFriendId(existingFriend.id);
                setShowWelcomeModal(false);
              } else {
                // Rename the default "Me (You)" profile if it's untouched
                const meFriend = friends.find(f => f.id === 'me');
                if (meFriend && meFriend.name === 'Me (You)') {
                  const updatedFriends = friends.map(f => f.id === 'me' ? { ...f, name: name, avatar: name.slice(0, 2).toUpperCase() } : f);
                  setFriends(updatedFriends);
                  setMyFriendId('me');
                  localStorage.setItem('lollasync_my_friend_id', 'me');
                  setActiveFriendId('me');
                  setShowWelcomeModal(false);
                  if (sheetsUrl && syncEnabled) {
                    saveStateToSheets(sheetsUrl, updatedFriends, groupPreferences, overrides, splits);
                  }
                } else {
                  // Create a new friend
                  const newId = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
                  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                  const newFriend: Friend = {
                    id: newId,
                    name: name,
                    color: `hsl(${Math.random() * 360}, 85%, 65%)`,
                    avatar: initials || name[0].toUpperCase()
                  };
                  const updatedFriends = [...friends, newFriend];
                  setFriends(updatedFriends);
                  setMyFriendId(newId);
                  localStorage.setItem('lollasync_my_friend_id', newId);
                  setActiveFriendId(newId);
                  setShowWelcomeModal(false);
                  if (sheetsUrl && syncEnabled) {
                    saveStateToSheets(sheetsUrl, updatedFriends, groupPreferences, overrides, splits);
                  }
                }
              }
            }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                name="username"
                required
                placeholder="Your Name (e.g. Erica, Alice, Bob)"
                autoFocus
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '1rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '12px', justifyContent: 'center', fontSize: '1rem', width: '100%' }}>
                Join Squad 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
