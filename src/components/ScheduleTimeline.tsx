import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Artist, Friend, GroupPreferences, HypeLevel, WalkWarning } from '../types';
import { formatTimeStr, getWalkingTime } from '../mockData';
import { Clock, MapPin, Footprints, AlertTriangle, Users, Compass, CheckCircle } from 'lucide-react';

interface ScheduleTimelineProps {
  artists: Artist[];
  friends: Friend[];
  activeFriendId: string;
  groupPreferences: GroupPreferences;
  viewMode: 'personal' | 'squad';
  overrides?: Record<string, string[]>;
  onToggleOverride?: (friendId: string, artistId: string) => void;
  splits?: Record<string, string[]>;
  onToggleSplit?: (friendId: string, artist1Id: string, artist2Id: string) => void;
  myFriendId?: string | null;
  isSaving?: boolean;
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  artists,
  friends,
  activeFriendId,
  groupPreferences,
  viewMode,
  overrides = {},
  onToggleOverride,
  splits = {},
  onToggleSplit,
  myFriendId = null,
  isSaving = false
}) => {
  const activeFriend = friends.find(f => f.id === activeFriendId) || friends[0] || { id: 'me', name: 'Me (You)', color: '#FF007F', avatar: 'MY' };

  // Track exiting clash pairs for exit animation
  type ClashPairEntry = { first: Artist; second: Artist; firstScheduled: boolean; secondScheduled: boolean };
  const [exitingPairs, setExitingPairs] = useState<Record<string, ClashPairEntry>>({});
  const prevClashKeysRef = useRef<Record<string, ClashPairEntry>>({});
  // Track which artist ID is currently being swapped (for loading state)
  const [swappingId, setSwappingId] = useState<string | null>(null);

  // Clear loading state when the save finishes
  useEffect(() => {
    if (!isSaving && swappingId !== null) {
      setSwappingId(null);
    }
  }, [isSaving]);

  // ==========================================
  // HELPER ALGORITHM FOR CONFLICT RESOLUTION
  // ==========================================
  const getFriendSchedule = (friendId: string) => {
    const prefs = groupPreferences[friendId] || {};
    const friendOverrides = overrides[friendId] || [];
    const friendSplits = splits[friendId] || [];
    const priorityVal = { must: 3, want: 2, maybe: 1, none: 0 };

    // Get active friend's selected artists
    const selected = artists
      .filter(a => prefs[a.id] && prefs[a.id] !== 'none')
      .map(a => {
        const isOverridden = friendOverrides.includes(a.id);
        const isSplitRequested = friendSplits.includes(a.id);
        return {
          ...a,
          priorityWeight: isOverridden ? 10 : priorityVal[prefs[a.id] as HypeLevel] || 0,
          isSplitRequested,
          originalStartTime: a.startTime,
          originalEndTime: a.endTime,
          originalStartMinutes: a.startMinutes,
          originalEndMinutes: a.endMinutes,
          isSplitActive: false,
          splitType: 'none' as 'none' | 'first' | 'second'
        };
      })
      // Sort by start time, then priority weight
      .sort((a, b) => {
        if (a.startMinutes !== b.startMinutes) {
          return a.startMinutes - b.startMinutes;
        }
        return b.priorityWeight - a.priorityWeight;
      });

    // Process using a queue so displaced artists get re-evaluated
    const queue = [...selected];
    const accepted: any[] = [];
    const clashed: { artist: any; conflictingWith: any }[] = [];

    while (queue.length > 0) {
      const candidate = queue.shift()!;
      let conflictWith: any = null;

      for (const acceptedAct of accepted) {
        const overlap = candidate.startMinutes < acceptedAct.endMinutes && candidate.endMinutes > acceptedAct.startMinutes;
        if (overlap) {
          conflictWith = acceptedAct;
          break;
        }
      }

      if (!conflictWith) {
        accepted.push(candidate);
        accepted.sort((a, b) => a.startMinutes - b.startMinutes);
      } else {
        // Resolve with Split if requested for both
        if (candidate.isSplitRequested && conflictWith.isSplitRequested) {
          const walkTime = getWalkingTime(conflictWith.stage, candidate.stage);
          const os = Math.max(conflictWith.startMinutes, candidate.startMinutes);
          const oe = Math.min(conflictWith.endMinutes, candidate.endMinutes);
          const midpoint = Math.floor((os + oe) / 2);

          const firstEnd = midpoint - Math.ceil(walkTime / 2);
          const secondStart = midpoint + Math.floor(walkTime / 2);

          const isFirstViable = firstEnd - conflictWith.startMinutes >= 10;
          const isSecondViable = candidate.endMinutes - secondStart >= 10;

          if (isFirstViable && isSecondViable) {
            conflictWith.endMinutes = firstEnd;
            const fh = Math.floor((firstEnd + 720) / 60);
            const fm = (firstEnd + 720) % 60;
            conflictWith.endTime = `${String(fh).padStart(2, '0')}:${String(fm).padStart(2, '0')}`;
            conflictWith.isSplitActive = true;
            conflictWith.splitType = 'first';

            candidate.startMinutes = secondStart;
            const sh = Math.floor((secondStart + 720) / 60);
            const sm = (secondStart + 720) % 60;
            candidate.startTime = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
            candidate.isSplitActive = true;
            candidate.splitType = 'second';

            accepted.push(candidate);
            accepted.sort((a, b) => a.startMinutes - b.startMinutes);
            continue;
          }
        }

        const candidateWeight = candidate.priorityWeight;
        const acceptedWeight = conflictWith.priorityWeight || 0;

        if (candidateWeight > acceptedWeight) {
          // Candidate wins: remove the accepted artist and re-evaluate it
          const index = accepted.indexOf(conflictWith);
          accepted.splice(index, 1);

          if (conflictWith.isSplitActive) {
            conflictWith.startTime = conflictWith.originalStartTime;
            conflictWith.endTime = conflictWith.originalEndTime;
            conflictWith.startMinutes = conflictWith.originalStartMinutes;
            conflictWith.endMinutes = conflictWith.originalEndMinutes;
            conflictWith.isSplitActive = false;
            conflictWith.splitType = 'none';
          }

          accepted.push(candidate);
          accepted.sort((a, b) => a.startMinutes - b.startMinutes);
          // Put displaced artist back in queue to be re-evaluated
          queue.unshift(conflictWith);
        } else {
          clashed.push({ artist: candidate, conflictingWith: conflictWith });
        }
      }
    }

    return { accepted, clashed };
  };

  // ==========================================
  // PERSONAL ITINERARY OPTIMIZER ALGORITHM
  // ==========================================
  const personalSchedule = useMemo(() => {
    const { accepted, clashed } = getFriendSchedule(activeFriend.id);
    
    // Compute travel warnings between consecutive sets
    const warnings: WalkWarning[] = [];
    for (let i = 0; i < accepted.length - 1; i++) {
      const current = accepted[i];
      const next = accepted[i + 1];
      
      const gap = next.startMinutes - current.endMinutes;
      const walkTime = getWalkingTime(current.stage, next.stage);

      if (walkTime > 0) {
        if (gap < walkTime + 5) {
          warnings.push({
            fromArtist: current,
            toArtist: next,
            minutesGap: gap,
            estimatedWalkTime: walkTime,
            isImpossible: gap < walkTime
          });
        }
      }
    }

    return { accepted, clashed, warnings };
  }, [artists, activeFriend.id, groupPreferences, overrides, splits]);

  const clashPairs = useMemo(() => {
    const { clashed, accepted } = personalSchedule;
    const pairs: { first: Artist; second: Artist; firstScheduled: boolean; secondScheduled: boolean }[] = [];
    const seen = new Set<string>();

    clashed.forEach(({ artist, conflictingWith }) => {
      const sortedIds = [artist.id, conflictingWith.id].sort();
      const key = sortedIds.join('_');
      if (!seen.has(key)) {
        seen.add(key);
        const [first, second] = artist.startMinutes <= conflictingWith.startMinutes 
          ? [artist, conflictingWith] 
          : [conflictingWith, artist];

        const firstScheduled = accepted.some(a => a.id === first.id);
        const secondScheduled = accepted.some(a => a.id === second.id);

        pairs.push({
          first,
          second,
          firstScheduled,
          secondScheduled
        });
      }
    });

    return pairs;
  }, [personalSchedule]);

  // Detect removed clash pairs and play exit animation
  useEffect(() => {
    const currentKeys = new Set(clashPairs.map(({ first, second }) => [first.id, second.id].sort().join('_')));
    const removedEntries: Record<string, ClashPairEntry> = {};

    Object.entries(prevClashKeysRef.current).forEach(([key, entry]) => {
      if (!currentKeys.has(key)) {
        removedEntries[key] = entry;
      }
    });

    // Prune prev ref to only current keys
    prevClashKeysRef.current = Object.fromEntries(
      Object.entries(prevClashKeysRef.current).filter(([k]) => currentKeys.has(k))
    );

    if (Object.keys(removedEntries).length === 0) return;

    setExitingPairs(prev => ({ ...prev, ...removedEntries }));
    const timer = setTimeout(() => {
      setExitingPairs(prev => {
        const next = { ...prev };
        Object.keys(removedEntries).forEach(k => delete next[k]);
        return next;
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [clashPairs]);

  // ==========================================
  // SQUAD SYNC / OVERLAP CALCULATIONS
  // ==========================================
  const squadTimeline = useMemo(() => {
    const selectedArtists = artists.filter(artist => {
      return friends.some(f => {
        const pref = groupPreferences[f.id]?.[artist.id];
        return pref && pref !== 'none';
      });
    });

    const friendSchedules: Record<string, Artist[]> = {};
    friends.forEach(f => {
      friendSchedules[f.id] = getFriendSchedule(f.id).accepted;
    });

    // Find all unique set time intervals for the day
    // We can define "time slots" based on unique start/end combinations
    const timeIntervals: { start: number; end: number; startStr: string; endStr: string }[] = [];
    selectedArtists.forEach(a => {
      const exists = timeIntervals.some(ti => ti.start === a.startMinutes && ti.end === a.endMinutes);
      if (!exists) {
        timeIntervals.push({
          start: a.startMinutes,
          end: a.endMinutes,
          startStr: a.startTime,
          endStr: a.endTime
        });
      }
    });

    // Sort intervals chronologically
    timeIntervals.sort((a, b) => a.start - b.start || a.end - b.end);

    // Build the grid data for each interval
    return timeIntervals.map(interval => {
      // Find artists performing during this specific block
      const performingArtists = artists.filter(a => a.startMinutes === interval.start && a.endMinutes === interval.end);

      // Group friends by which performing artist they are seeing
      const distribution = performingArtists.map(artist => {
        const attendingFriends = friends.filter(f => {
          const personalOptimized = friendSchedules[f.id] || [];
          return personalOptimized.some(optArtist => optArtist.id === artist.id);
        });

        return {
          artist,
          friends: attendingFriends
        };
      }).filter(group => group.friends.length > 0); // Only keep stages that someone is going to

      // Check if squad is together
      // Squad Linkup is true if everyone who is going to a set in this interval is at the same stage
      const totalAttendees = distribution.reduce((sum, d) => sum + d.friends.length, 0);
      const isSquadHangout = distribution.length === 1 && totalAttendees > 1;

      return {
        interval,
        distribution,
        isSquadHangout,
        totalAttendees
      };
    }).filter(slot => slot.totalAttendees > 0); // Only show slots where someone is active
  }, [artists, friends, groupPreferences]);


  // ==========================================
  // RENDER PERSONAL ITINERARY
  // ==========================================
  if (viewMode === 'personal') {
    const { accepted, warnings } = personalSchedule;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Optimizer Header Summary */}
        <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(255, 0, 127, 0.05) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={22} style={{ color: 'var(--neon-cyan)' }} />
                Optimal Route: {activeFriend.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Personal conflict-free path generated using Priority Ratings & walking speeds.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--neon-cyan)' }}>
                  {accepted.length}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sets Scheduled</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--neon-orange)' }}>
                  {warnings.length}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Transit Alerts</span>
              </div>
            </div>
          </div>
        </div>

        {accepted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: '12px' }}>
            <Clock size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h4 style={{ color: '#fff', marginBottom: '4px' }}>No Itinerary Generated</h4>
            <p style={{ fontSize: '0.85rem' }}>Select artists in the "Daily Lineup" directory and rate them as 🔥 Must See or ⭐ Want to See to compile an optimized schedule.</p>
          </div>
        ) : (
          <div className="timeline-flow">
            {accepted.map((artist) => {
              const currentHype = groupPreferences[activeFriend.id]?.[artist.id] as HypeLevel;
              // Check if there is a warning following this set
              const walkWarning = warnings.find(w => w.fromArtist.id === artist.id);

              return (
                <div key={artist.id} className="timeline-item">
                  <div className="timeline-node" style={{ borderColor: activeFriend.color }} />
                  
                  <div className="timeline-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span 
                            style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 700, 
                              background: currentHype === 'must' ? 'var(--neon-pink-glow)' : 'var(--neon-cyan-glow)',
                              color: currentHype === 'must' ? 'var(--neon-pink)' : 'var(--neon-cyan)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: `1px solid ${currentHype === 'must' ? 'var(--neon-pink)' : 'var(--neon-cyan)'}40`
                            }}
                          >
                            {currentHype === 'must' ? '🔥 MUST SEE' : currentHype === 'want' ? '⭐ WANT TO SEE' : '💤 MAYBE'}
                          </span>
                          
                          {overrides[activeFriend.id]?.includes(artist.id) && (
                            <span 
                              style={{ 
                                fontSize: '0.7rem', 
                                fontWeight: 700, 
                                background: 'rgba(255, 223, 0, 0.15)',
                                color: 'var(--neon-yellow)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid rgba(255, 223, 0, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: activeFriendId === myFriendId ? 'pointer' : 'default'
                              }}
                              onClick={() => activeFriendId === myFriendId && onToggleOverride && onToggleOverride(activeFriend.id, artist.id)}
                              title={activeFriendId === myFriendId ? "Click to remove swap override" : "Swapped schedule override"}
                            >
                              🔄 Swapped {activeFriendId === myFriendId && '✕'}
                            </span>
                          )}

                          {artist.isSplitActive && artist.splitType === 'first' && (
                            <span 
                              style={{ 
                                fontSize: '0.7rem', 
                                fontWeight: 700, 
                                background: 'rgba(255, 0, 127, 0.1)',
                                color: 'var(--neon-pink)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid rgba(255, 0, 127, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: activeFriendId === myFriendId ? 'pointer' : 'default'
                              }}
                              onClick={() => activeFriendId === myFriendId && onToggleSplit && onToggleSplit(activeFriend.id, artist.id, '')}
                              title={activeFriendId === myFriendId ? "Click to remove split time" : "Split Set"}
                            >
                              ✂️ Split (Leaves Early) {activeFriendId === myFriendId && '✕'}
                            </span>
                          )}

                          {artist.isSplitActive && artist.splitType === 'second' && (
                            <span 
                              style={{ 
                                fontSize: '0.7rem', 
                                fontWeight: 700, 
                                background: 'rgba(0, 240, 255, 0.1)',
                                color: 'var(--neon-cyan)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid rgba(0, 240, 255, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: activeFriendId === myFriendId ? 'pointer' : 'default'
                              }}
                              onClick={() => activeFriendId === myFriendId && onToggleSplit && onToggleSplit(activeFriend.id, artist.id, '')}
                              title={activeFriendId === myFriendId ? "Click to remove split time" : "Split Set"}
                            >
                              ✂️ Split (Arrives Late) {activeFriendId === myFriendId && '✕'}
                            </span>
                          )}

                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            {formatTimeStr(artist.startTime)} - {formatTimeStr(artist.endTime)}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.35rem', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                          {artist.name}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} style={{ color: activeFriend.color }} />
                          {artist.stage}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {artist.genre}
                        </span>
                      </div>
                    </div>

                    {/* Transit warning overlay */}
                    {walkWarning && (
                      <div className={`transit-warning ${walkWarning.isImpossible ? 'impossible' : ''}`}>
                        {walkWarning.isImpossible ? (
                          <>
                            <AlertTriangle size={18} className="warning-icon" />
                            <div>
                              <strong>Impossible Transition Clash!</strong> Set starts instantly. Requires a{' '}
                              <strong>{walkWarning.estimatedWalkTime} min walk</strong> from{' '}
                              {walkWarning.fromArtist.stage} to {walkWarning.toArtist.stage}. Consider leaving early.
                            </div>
                          </>
                        ) : (
                          <>
                            <Footprints size={18} className="warning-icon" />
                            <div>
                              <strong>Tight Transition Alert:</strong> Only <strong>{walkWarning.minutesGap} mins</strong> between sets.{' '}
                              Walk time is estimated at <strong>{walkWarning.estimatedWalkTime} mins</strong>.
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Display Clash/Skipped Artists */}
        {(clashPairs.length > 0 || Object.keys(exitingPairs).length > 0) && (
          <div className="glass-panel" style={{ padding: '20px', marginTop: '20px', borderStyle: 'dashed' }}>
            <h4 style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.95rem' }}>
              <AlertTriangle size={16} />
              Overlapping Conflicts Resolved (Skipped)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              These sets have overlapping schedules. Choose which one to force-schedule or split the time between them.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Exiting pairs (fade-out animation) */}
              {Object.entries(exitingPairs).map(([pairKey, { first, second }]) => (
                <div
                  key={`exit_${pairKey}`}
                  className="clash-card-exit"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.01)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    border: '1px solid var(--border-light)',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{first.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({first.startTime} @ {first.stage})</span>
                    <span style={{ color: 'var(--text-muted)', margin: '0 4px', fontSize: '0.75rem' }}>vs</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{second.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({second.startTime} @ {second.stage})</span>
                  </div>
                </div>
              ))}

              {clashPairs.map(({ first, second, firstScheduled, secondScheduled }) => {
                const pairKey = [first.id, second.id].sort().join('_');
                const isSplit = splits[activeFriend.id]?.includes(first.id) && splits[activeFriend.id]?.includes(second.id);

                // Sync ref on each render
                prevClashKeysRef.current[pairKey] = { first, second, firstScheduled, secondScheduled };

                return (
                  <div 
                    key={`${first.id}_${second.id}`}
                    className="clash-card-enter"
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      background: 'rgba(255,255,255,0.01)', 
                      padding: '10px 14px', 
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      border: '1px solid var(--border-light)',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        color: firstScheduled ? 'var(--neon-yellow)' : 'var(--text-secondary)', 
                        fontWeight: firstScheduled ? 600 : 400 
                      }}>
                        {first.name}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({first.startTime} @ {first.stage})</span>
                      
                      <span style={{ color: 'var(--text-muted)', margin: '0 4px', fontSize: '0.75rem' }}>vs</span>
                      
                      <span style={{ 
                        color: secondScheduled ? 'var(--neon-yellow)' : 'var(--text-secondary)', 
                        fontWeight: secondScheduled ? 600 : 400 
                      }}>
                        {second.name}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({second.startTime} @ {second.stage})</span>
                    </div>

                    {activeFriend.id === myFriendId && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Show one swap button targeting the skipped artist */}
                        {!firstScheduled && (() => {
                          const isSwapping = swappingId === first.id;
                          return (
                            <button
                              onClick={() => {
                                if (!isSwapping) {
                                  setSwappingId(first.id);
                                  onToggleOverride && onToggleOverride(activeFriend.id, first.id);
                                }
                              }}
                              className="btn"
                              disabled={isSwapping}
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.7rem',
                                borderRadius: '4px',
                                borderColor: isSwapping ? 'rgba(255,223,0,0.2)' : 'rgba(255,223,0,0.4)',
                                color: isSwapping ? 'rgba(255,223,0,0.5)' : 'var(--neon-yellow)',
                                background: isSwapping ? 'rgba(255,223,0,0.06)' : 'rgba(255,223,0,0.02)',
                                cursor: isSwapping ? 'default' : 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex', alignItems: 'center', gap: '5px'
                              }}
                            >
                              {isSwapping
                                ? <><span style={{ display: 'inline-block', width: 10, height: 10, border: '1.5px solid rgba(255,223,0,0.3)', borderTopColor: 'var(--neon-yellow)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />Swapping...</>
                                : `🔄 Swap to ${first.name}`}
                            </button>
                          );
                        })()}
                        {!secondScheduled && (() => {
                          const isSwapping = swappingId === second.id;
                          return (
                            <button
                              onClick={() => {
                                if (!isSwapping) {
                                  setSwappingId(second.id);
                                  onToggleOverride && onToggleOverride(activeFriend.id, second.id);
                                }
                              }}
                              className="btn"
                              disabled={isSwapping}
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.7rem',
                                borderRadius: '4px',
                                borderColor: isSwapping ? 'rgba(255,223,0,0.2)' : 'rgba(255,223,0,0.4)',
                                color: isSwapping ? 'rgba(255,223,0,0.5)' : 'var(--neon-yellow)',
                                background: isSwapping ? 'rgba(255,223,0,0.06)' : 'rgba(255,223,0,0.02)',
                                cursor: isSwapping ? 'default' : 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex', alignItems: 'center', gap: '5px'
                              }}
                            >
                              {isSwapping
                                ? <><span style={{ display: 'inline-block', width: 10, height: 10, border: '1.5px solid rgba(255,223,0,0.3)', borderTopColor: 'var(--neon-yellow)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />Swapping...</>
                                : `🔄 Swap to ${second.name}`}
                            </button>
                          );
                        })()}

                        {/* Split Set Button */}
                        {onToggleSplit && (
                          <button
                            onClick={() => onToggleSplit(activeFriend.id, first.id, second.id)}
                            className="btn"
                            style={{
                              padding: '3px 8px',
                              fontSize: '0.7rem',
                              borderRadius: '4px',
                              borderColor: 'var(--neon-cyan)',
                              color: 'var(--neon-cyan)',
                              background: isSplit ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0, 240, 255, 0.05)',
                            }}
                          >
                            ✂️ Split Set
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // RENDER SQUAD COORDINATION SYNC
  // ==========================================
  return (
    <div className="squad-dashboard">
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.04) 0%, rgba(0, 240, 255, 0.04) 100%)' }}>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={22} style={{ color: 'var(--neon-green)' }} />
          Squad Sync: Who's Where?
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          See where friends overlap in real-time. The list maps out who is scheduled at which stage for every time slot.
        </p>
      </div>

      <div className="squad-slots-list">
        {squadTimeline.length > 0 ? (
          squadTimeline.map(({ interval, distribution, isSquadHangout }) => (
            <div key={`${interval.start}-${interval.end}`} className="squad-time-slot">
              
              {/* Time Label */}
              <div className="squad-time-label">
                <span className="squad-time-range">
                  {formatTimeStr(interval.startStr)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  to {formatTimeStr(interval.endStr)}
                </span>
              </div>

              {/* Stage and Friend distribution */}
              <div className="squad-stage-distribution">
                {distribution.map(({ artist, friends: attendees }) => (
                  <div 
                    key={artist.id} 
                    className={`squad-stage-group ${isSquadHangout ? 'squad-hangout' : ''}`}
                  >
                    <div>
                      <span className="squad-stage-name">📍 {artist.stage}</span>
                      <h4 className="squad-artist-name">
                        {artist.name}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{artist.genre}</span>
                    </div>

                    {/* Attendees Avatars list */}
                    <div className="squad-member-avatars">
                      {isSquadHangout && (
                        <span 
                          style={{ 
                            fontSize: '0.7rem', 
                            color: 'var(--neon-green)', 
                            fontWeight: 700, 
                            background: 'rgba(57,255,20,0.1)', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            border: '1px solid rgba(57,255,20,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CheckCircle size={12} />
                          Squad Linkup!
                        </span>
                      )}
                      
                      <div className="squad-badges-container">
                        {attendees.map(friend => (
                          <div 
                            key={friend.id} 
                            className="friend-avatar" 
                            style={{ 
                              backgroundColor: friend.color,
                              color: '#000',
                              boxShadow: `0 0 6px ${friend.color}60`
                            }}
                            title={friend.name}
                          >
                            {friend.avatar}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: '12px' }}>
            <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h4 style={{ color: '#fff', marginBottom: '4px' }}>No Active Selections</h4>
            <p style={{ fontSize: '0.85rem' }}>Friends need to select artists in the lineup for their schedules to appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
