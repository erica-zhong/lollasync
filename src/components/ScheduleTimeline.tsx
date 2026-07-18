import React, { useMemo } from 'react';
import { Artist, Friend, GroupPreferences, HypeLevel, WalkWarning } from '../types';
import { formatTimeStr, getWalkingTime } from '../mockData';
import { Clock, MapPin, Footprints, AlertTriangle, Users, Compass, CheckCircle } from 'lucide-react';

interface ScheduleTimelineProps {
  artists: Artist[];
  friends: Friend[];
  activeFriendId: string;
  groupPreferences: GroupPreferences;
  viewMode: 'personal' | 'squad';
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  artists,
  friends,
  activeFriendId,
  groupPreferences,
  viewMode
}) => {
  const activeFriend = friends.find(f => f.id === activeFriendId) || friends[0];

  // ==========================================
  // PERSONAL ITINERARY OPTIMIZER ALGORITHM
  // ==========================================
  const personalSchedule = useMemo(() => {
    // 1. Get active friend's preferences
    const prefs = groupPreferences[activeFriend.id] || {};
    
    // 2. Filter for selected artists (must, want, maybe)
    const selected = artists
      .filter(a => prefs[a.id] && prefs[a.id] !== 'none')
      .map(a => ({
        ...a,
        priority: prefs[a.id] as HypeLevel
      }))
      // Sort by start time, then priority (must > want > maybe)
      .sort((a, b) => {
        if (a.startMinutes !== b.startMinutes) {
          return a.startMinutes - b.startMinutes;
        }
        const priorityVal = { must: 3, want: 2, maybe: 1, none: 0 };
        return priorityVal[b.priority] - priorityVal[a.priority];
      });

    const accepted: Artist[] = [];
    const clashed: { artist: Artist; conflictingWith: Artist }[] = [];

    // Priority hierarchy weights
    const priorityVal = { must: 3, want: 2, maybe: 1, none: 0 };

    selected.forEach(candidate => {
      // Check for overlap with already accepted artists
      let conflictWith: Artist | null = null;
      
      for (const acceptedAct of accepted) {
        // Two artists overlap if:
        // Start of B is before end of A, AND end of B is after start of A
        const overlap = candidate.startMinutes < acceptedAct.endMinutes && candidate.endMinutes > acceptedAct.startMinutes;
        if (overlap) {
          conflictWith = acceptedAct;
          break;
        }
      }

      if (!conflictWith) {
        accepted.push(candidate);
      } else {
        // Resolve conflict: check if candidate has strictly HIGHER priority
        const candidatePriority = prefs[candidate.id] || 'none';
        const acceptedPriority = prefs[conflictWith.id] || 'none';

        if (priorityVal[candidatePriority] > priorityVal[acceptedPriority]) {
          // Replace accepted act with candidate
          const index = accepted.indexOf(conflictWith);
          accepted.splice(index, 1);
          accepted.push(candidate);
          // Old one becomes clashed
          clashed.push({ artist: conflictWith, conflictingWith: candidate });
          // Sort accepted again since we replaced an element
          accepted.sort((a, b) => a.startMinutes - b.startMinutes);
        } else {
          // Reject candidate as clashed
          clashed.push({ artist: candidate, conflictingWith: conflictWith });
        }
      }
    });

    // 3. Compute travel warnings between consecutive sets
    const warnings: WalkWarning[] = [];
    for (let i = 0; i < accepted.length - 1; i++) {
      const current = accepted[i];
      const next = accepted[i + 1];
      
      const gap = next.startMinutes - current.endMinutes;
      const walkTime = getWalkingTime(current.stage, next.stage);

      if (walkTime > 0) {
        // Alert if the gap is tight (less than walking time + 5 mins buffer)
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
  }, [artists, activeFriend.id, groupPreferences]);

  // ==========================================
  // SQUAD SYNC / OVERLAP CALCULATIONS
  // ==========================================
  const squadTimeline = useMemo(() => {
    // Group all active artist selections across ALL friends
    // We want to list timeslots chronologically and see who is where.
    
    // First, find all artists selected by at least one person
    const selectedArtists = artists.filter(artist => {
      return friends.some(f => {
        const pref = groupPreferences[f.id]?.[artist.id];
        return pref && pref !== 'none';
      });
    });

    // We need to resolve each friend's personal optimized schedule first
    // so we only display where they actually end up (conflict-free) in the squad view!
    // This is much cleaner than showing them at 3 stages at once.
    const friendSchedules: Record<string, Artist[]> = {};
    friends.forEach(f => {
      const prefs = groupPreferences[f.id] || {};
      const fSelected = artists
        .filter(a => prefs[a.id] && prefs[a.id] !== 'none')
        .sort((a, b) => a.startMinutes - b.startMinutes);

      const fAccepted: Artist[] = [];
      const priorityVal = { must: 3, want: 2, maybe: 1, none: 0 };

      fSelected.forEach(candidate => {
        let conflictWith: Artist | null = null;
        for (const act of fAccepted) {
          if (candidate.startMinutes < act.endMinutes && candidate.endMinutes > act.startMinutes) {
            conflictWith = act;
            break;
          }
        }
        if (!conflictWith) {
          fAccepted.push(candidate);
        } else {
          const candidatePriority = prefs[candidate.id] as HypeLevel;
          const acceptedPriority = prefs[conflictWith.id] as HypeLevel;
          if (priorityVal[candidatePriority] > priorityVal[acceptedPriority]) {
            const idx = fAccepted.indexOf(conflictWith);
            fAccepted.splice(idx, 1);
            fAccepted.push(candidate);
            fAccepted.sort((a, b) => a.startMinutes - b.startMinutes);
          }
        }
      });
      friendSchedules[f.id] = fAccepted;
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
    const { accepted, clashed, warnings } = personalSchedule;

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
        {clashed.length > 0 && (
          <div className="glass-panel" style={{ padding: '20px', marginTop: '20px', borderStyle: 'dashed' }}>
            <h4 style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.95rem' }}>
              <AlertTriangle size={16} />
              Overlapping Conflicts Resolved (Skipped)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              These selected sets were skipped because they overlapped with higher-priority artists.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {clashed.map(({ artist, conflictingWith }) => (
                <div 
                  key={artist.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    background: 'rgba(255,255,255,0.01)', 
                    padding: '8px 12px', 
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{artist.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}> ({artist.startTime} @ {artist.stage})</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    Clashes with <strong style={{ color: 'var(--neon-pink)' }}>{conflictingWith.name}</strong>
                  </div>
                </div>
              ))}
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
