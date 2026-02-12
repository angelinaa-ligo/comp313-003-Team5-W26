// apps/web/src/pages/EventPage.tsx

import '../styles/components/eventPage.css';
import type { Event } from '../types';
import CreateEventButton from '../components/CreateEventButton';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { AuthService } from '../services/AuthService';
import React from 'react';
import { useUserRole } from '../hooks/useUserRole';

export default function EventPage() {
  const { isJuniorMember } = useUserRole();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const base =
      (import.meta as any).env?.VITE_API_BASE || 'http://127.0.0.1:8080';

    const fetchEvents = async (groupId?: string | null) => {
      if (!mounted) return;
      setLoading(true);
      setError(null);
      try {
        const token = AuthService.getToken();
        const url = groupId
          ? `${base}/events?groupId=${encodeURIComponent(groupId)}`
          : `${base}/events`;
        const resp = await fetch(url, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
        const data = await resp.json();
        const mapped: Event[] = (data || []).map((e: any) => ({
          id: e.eventId || String(e._id),
          // Prefer the resolved creatorName provided by the backend; fallback to creatorUserId
          author: e.creatorName || e.creatorUserId || 'Member',
          creatorUserId: e.creatorUserId || null,
          title: e.title || '',
          description: e.description || '',
          startDate: e.startDate || '',
          timeStart: e.timeStart || '',
          endDate: e.endDate || '',
          timeEnd: e.timeEnd || '',
          location: e.location || '',
          interested: false,
          interestedCount:
            typeof e.interestedCount === 'number' ? e.interestedCount : 0,
        }));
        if (mounted) setEvents(mapped);
      } catch (err: any) {
        if (mounted) setError(String(err.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const stored = localStorage.getItem('activeGroupId');
    fetchEvents(stored);

    const onActive = (e: any) => {
      const gid = e && e.detail && e.detail.groupId ? e.detail.groupId : null;
      fetchEvents(gid);
    };
    window.addEventListener('activeGroupChanged', onActive);

    return () => {
      mounted = false;
      window.removeEventListener('activeGroupChanged', onActive);
    };
  }, []);

  return (
    <div className="feed-wrapper" data-theme="light">
      <header>
        <Header />
      </header>
      <main className="feed">
        {loading && <div>Loading events…</div>}
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        {!loading &&
          !error &&
          events.map((e) => <EventCard key={e.id} event={e} />)}
        {/* Hide create-event FAB for junior users */}
        {!isJuniorMember && (
          <div className="add-event">
            <CreateEventButton to="/create-event" />
          </div>
        )}
      </main>
      <footer className="feed-footer">
        <Navbar />
      </footer>
    </div>
  );
}
