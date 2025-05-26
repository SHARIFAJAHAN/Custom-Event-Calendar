import React, { useState, useEffect } from 'react';

const EventForm = ({ onSubmit, initialEvent = null, onDelete, selectedDay }) => {
  const [event, setEvent] = useState({
    title: '',
    start: '',
    end: '',
    recurrence: 'none',
    color: '#e0e0e0'
  });

  useEffect(() => {
    if (initialEvent) {
      setEvent(initialEvent);
    } else if (selectedDay) {
      const startDate = new Date(selectedDay);
      startDate.setHours(9, 0, 0);
      const endDate = new Date(selectedDay);
      endDate.setHours(10, 0, 0);
      setEvent(prev => ({
        ...prev,
        start: startDate.toISOString().slice(0, 16),
        end: endDate.toISOString().slice(0, 16)
      }));
    }
  }, [initialEvent, selectedDay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure all required fields are present
    const eventToSubmit = {
      ...event,
      id: event.id || Date.now().toString(),
      date: event.start ? event.start.split('T')[0] : '',
      color: event.color || '#e0e0e0',
      recurrence: event.recurrence || 'none'
    };

    onSubmit(eventToSubmit);
  };

  const handleDelete = () => {
    if (initialEvent) {
      onDelete(initialEvent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Event Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={event.title}
          onChange={handleChange}
          placeholder="Event Title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="start">Start Time</label>
        <input
          type="datetime-local"
          id="start"
          name="start"
          value={event.start}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="end">End Time</label>
        <input
          type="datetime-local"
          id="end"
          name="end"
          value={event.end}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="recurrence">Recurrence</label>
        <select
          id="recurrence" 
          name="recurrence" 
          value={event.recurrence} 
          onChange={handleChange}
        >
          <option value="none">No Recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="color">Event Color</label>
        <input
          type="color"
          id="color"
          name="color"
          value={event.color}
          onChange={handleChange}
        />
      </div>

      <div className="form-buttons">
        <button type="submit">Save Event</button>
        {initialEvent && (
          <button type="button" onClick={handleDelete}>Delete Event</button>
        )}
      </div>
    </form>
  );
};

export default EventForm;
