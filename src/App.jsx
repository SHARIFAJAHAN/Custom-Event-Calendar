import React from 'react';
import Calendar from './components/Calendar';
import CalendarHeader from './components/CalendarHeader';
import useCalendar from './hooks/useCalendar';
import useEvents from './hooks/useEvents';
import EventForm from './components/EventForm';

const App = () => {
  const { currentDate, goToPrevMonth, goToNextMonth, setCurrentDate } = useCalendar();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedDay(null);
    setShowEventForm(true);
  };

  const handleEventSubmit = (event) => {
    if (selectedEvent) {
      updateEvent(event.id, event);
    } else {
      addEvent(event);
    }
    setShowEventForm(false);
    setSelectedDay(null);
    setSelectedEvent(null);
  };

  const handleEventDelete = (eventId) => {
    deleteEvent(eventId);
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleCloseForm = () => {
    setShowEventForm(false);
    setSelectedDay(null);
    setSelectedEvent(null);
  };

  const handleMonthChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleYearChange = (newDate) => {
    setCurrentDate(newDate);
  };

  // Persist events to local storage
  React.useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Load events from local storage
  React.useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      parsedEvents.forEach(event => addEvent(event));
    }
  }, []);

  return (
    <div className="app">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      <Calendar
        currentDate={currentDate}
        events={events}
        onDayClick={handleDayClick}
        onEventClick={handleEventClick}
        updateEvent={updateEvent}
      />
      {showEventForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseForm}>×</button>
            <EventForm
              onSubmit={handleEventSubmit}
              onDelete={handleEventDelete}
              initialEvent={selectedEvent}
              selectedDay={selectedDay}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
