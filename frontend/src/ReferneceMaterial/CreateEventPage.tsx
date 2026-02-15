// apps/web/src/pages/CreateEventPage.tsx

import '../styles/components/createEvent.css';
import type { Event } from '../types';
import Header from '../components/Header';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/CreateEventCard';
import { AuthService } from '../services/AuthService';

const CreateEventSection = ({ event, setPage, updateField }: any) => {
  return (
    <form
      className="create-event-page"
      onSubmit={(e) => {
        e.preventDefault();
        setPage('preview');
      }}
    >
      <div className="event-name">
        <label>Event Name:</label>
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
          onClick={() => (window.location.href = '/events')}
        >
          Cancel
        </button>
        <button type="submit" className="next-event-button">
          Next
        </button>
      </footer>
    </form>
  );
};

const PreviewEventSection = ({ event, setPage, onSubmit }: any) => {
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
};
export default function CreateEventPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<'create' | 'preview'>('create');

  const [event, setEvent] = useState({
    title: '',
    location: '',
    startDate: '',
    timeStart: '',
    endDate: '',
    timeEnd: '',
    description: '',
    author: 'IDK We will have to worry about THIS later',
    interested: false,
    interestedCount: 0,
  });

  const updateField = (field: string, value: string) => {
    setEvent((prev) => ({ ...prev, [field]: value }));
  };

  const submitEvent = async () => {
    const base =
      (import.meta as any).env?.VITE_API_BASE || 'http://127.0.0.1:8080';
    const token = AuthService.getToken();
    const groupId = localStorage.getItem('activeGroupId');
    if (!groupId) {
      alert('Select a group before creating an event');
      return;
    }
    try {
      const payload = {
        groupId,
        title: event.title,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        timeStart: event.timeStart,
        timeEnd: event.timeEnd,
        description: event.description,
      };
      const resp = await fetch(`${base}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
      // success, navigate back to events list
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
          <CreateEventSection
            event={event}
            setPage={setPage}
            updateField={updateField}
            navigate={navigate}
          />
        ) : (
          <PreviewEventSection
            event={event}
            setPage={setPage}
            navigate={navigate}
            onSubmit={submitEvent}
          />
        )}
      </div>
    </div>
  );
}
