import { useState, useEffect } from 'react';

const useEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const generateRecurringEvents = (event) => {
    const { start, end, recurrence, title, color } = event;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = endDate - startDate;
    
    // Create the initial event with proper date
    const initialEvent = {
      ...event,
      id: event.id || Date.now().toString(),
      date: startDate.toISOString().split('T')[0],
      start: startDate.toISOString(),
      end: endDate.toISOString()
    };

    const recurringEvents = [initialEvent];

    if (recurrence === 'none') {
      return recurringEvents;
    }

    // Use the event's end date as the maximum date for recurrence
    const maxDate = new Date(endDate);
    let currentDate = new Date(startDate);
    const originalDay = startDate.getDate(); // Store the original day of the month
    
    // For weekly recurrence, ensure we start from the same day of the week
    if (recurrence === 'weekly') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (recurrence === 'monthly') {
      // For monthly, move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
      // Ensure we keep the same day of the month
      currentDate.setDate(originalDay);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    while (currentDate <= maxDate) {
      const newStart = new Date(currentDate);
      const newEnd = new Date(newStart.getTime() + duration);

      // Only add the event if it's a valid recurrence and before the end date
      if ((recurrence === 'daily' || 
          (recurrence === 'weekly' && newStart.getDay() === startDate.getDay()) ||
          (recurrence === 'monthly' && newStart.getDate() === originalDay)) &&
          newStart <= maxDate) {
        
        recurringEvents.push({
          ...event,
          id: `${event.id || Date.now().toString()}_${newStart.toISOString()}`,
          title,
          color,
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
          date: newStart.toISOString().split('T')[0],
          recurrence
        });
      }

      switch (recurrence) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          // Ensure we keep the same day of the month
          currentDate.setDate(originalDay);
          break;
        default:
          break;
      }
    }

    return recurringEvents;
  };

  const addEvent = (event) => {
    // Ensure all required fields are present and properly formatted
    const completeEvent = {
      ...event,
      color: event.color || '#e0e0e0',
      recurrence: event.recurrence || 'none',
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
      date: new Date(event.start).toISOString().split('T')[0]
    };

    const recurringEvents = generateRecurringEvents(completeEvent);
    const newEvents = [...events, ...recurringEvents];
    setEvents(newEvents);
    localStorage.setItem('events', JSON.stringify(newEvents));
  };

  const updateEvent = (eventId, updatedEvent) => {
    // Remove all instances of the recurring event
    const baseId = eventId.split('_')[0];
    const filteredEvents = events.filter(event => !event.id.startsWith(baseId));
    
    // Add the updated event with new recurring instances
    const recurringEvents = generateRecurringEvents({
      ...updatedEvent,
      id: baseId
    });
    
    const newEvents = [...filteredEvents, ...recurringEvents];
    setEvents(newEvents);
    localStorage.setItem('events', JSON.stringify(newEvents));
  };

  const deleteEvent = (eventId) => {
    // Remove all instances of the recurring event
    const baseId = eventId.split('_')[0];
    const newEvents = events.filter(event => !event.id.startsWith(baseId));
    setEvents(newEvents);
    localStorage.setItem('events', JSON.stringify(newEvents));
  };

  return { events, addEvent, updateEvent, deleteEvent };
};

export default useEvents;
