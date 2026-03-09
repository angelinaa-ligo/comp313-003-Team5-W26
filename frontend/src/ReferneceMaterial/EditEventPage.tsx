import '../styles/components/createEvent.css';
import type { Event } from '../types';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventCard from '../components/CreateEventCard';
import { AuthService } from '../services/AuthService';

//this is just a sample edit event page for redirection for now
//people are free to edit this page as they see fit

function CreationEventSection({ event, setPage, updateField, navigate }: any) {
  return (
    <form
      className="create-event-page"
      onSubmit={(e) => {
        e.preventDefault();
        setPage('preview');
      }}
    >
      <div className="event-name">
        <label>EDIT Event Name:</label>
        <input
          type="text"
          value={event.title}
          onChange={(e) => updateField('title', e.target.value)}
          required
        />
      </div>

      <div className="event-location">
        <label>Location:</label>
        <input
          type="text"
          value={event.location}
          onChange={(e) => updateField('location', e.target.value)}
          required
        />
      </div>

      <div className="event-dates-start">
        <label>Start Date:</label>
        <label>Start Time:</label>
        <input
          type="date"
          value={event.startDate}
          onChange={(e) => updateField('startDate', e.target.value)}
          required
        />
        <input
          type="time"
          value={event.timeStart}
          onChange={(e) => updateField('timeStart', e.target.value)}
          required
        />
      </div>

      <div className="event-dates-end">
        <label>End Date:</label>
        <label>End Time:</label>
        <input
          type="date"
          value={event.endDate}
          onChange={(e) => updateField('endDate', e.target.value)}
        />
        <input
          type="time"
          value={event.timeEnd}
          onChange={(e) => updateField('timeEnd', e.target.value)}
        />
      </div>

      <div className="event-description">
        <label>Description:</label>
        <textarea
          value={event.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
        ></textarea>
      </div>

      <footer>
        <button
          className="cancel-event-button"
          onClick={() => navigate('/events')}
        >
          Cancel
        </button>
        <button type="submit" className="next-event-button">
          Next
        </button>
      </footer>
    </form>
  );
}

//we can cut this section if we believe a preview is unnecessary
function PreviewSection({ event, setPage, onSubmit }: any) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '16px',
      }}
    >
      <div style={{ flex: 1 }}>
        <label className="create-event-title">Review</label>
        <EventCard event={event as Event} />
      </div>

      <footer>
        <button className="back-event-button" onClick={() => setPage('create')}>
          Back
        </button>
        <button
          className="submit-event-button"
          onClick={async () => {
            if (onSubmit) await onSubmit();
          }}
        >
          Submit
        </button>
      </footer>
    </div>
  );
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [page, setPage] = useState<'create' | 'preview'>('create');

  //this will be loaded from the server to prefill the event info
  const [event, setEvent] = useState<any>({
    title: '',
    location: '',
    startDate: '',
    timeStart: '',
    endDate: '',
    timeEnd: '',
    description: '',
    author: '',
    interested: false,
    interestedCount: 0,
  });

  const updateField = (field: string, value: string) => {
    setEvent((prev: any) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    let mounted = true;
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const base =
          (import.meta as any).env?.VITE_API_BASE || 'http://127.0.0.1:8080';
        const resp = await fetch(`${base}/events/${encodeURIComponent(id)}`);
        if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
        const data = await resp.json();
        if (!mounted) return;
        setEvent({
          title: data.title || '',
          location: data.location || '',
          startDate: data.startDate || '',
          timeStart: data.timeStart || '',
          endDate: data.endDate || '',
          timeEnd: data.timeEnd || '',
          description: data.description || '',
          author: data.creatorUserId || '',
          interested: false,
          interestedCount: data.interestedCount || 0,
        });
      } catch (err) {
        console.error('Failed to load event', err);
        alert('Failed to load event for editing');
        navigate('/events');
      }
    };
    fetchEvent();
    return () => {
      mounted = false;
    };
  }, [id]);

  const submitUpdate = async () => {
    if (!id) {
      alert('Missing event id');
      return;
    }
    try {
      const base =
        (import.meta as any).env?.VITE_API_BASE || 'http://127.0.0.1:8080';
      const token = AuthService.getToken();
      const payload: any = {
        title: event.title,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        timeStart: event.timeStart,
        timeEnd: event.timeEnd,
        description: event.description,
      };
      const resp = await fetch(`${base}/events/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.error || `Server returned ${resp.status}`);
      }
      navigate('/events');
    } catch (err: any) {
      alert(String(err.message || err));
    }
  };

  return (
    <div className="create-event-wrapper" data-theme="light">
      <div className="create-event-content">
        <Header />
        {page === 'create' ? (
          <CreationEventSection
            event={event}
            setPage={setPage}
            updateField={updateField}
            navigate={navigate}
          />
        ) : (
          <PreviewSection
            event={event}
            setPage={setPage}
            onSubmit={submitUpdate}
          />
        )}
      </div>
    </div>
  );
}
