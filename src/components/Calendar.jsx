import React from 'react';
import DayCell from './DayCell';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Calendar = ({ currentDate, events, onDayClick, onEventClick, updateEvent }) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const renderDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="day-cell empty">
          <div className="day-number"></div>
        </div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayString = dayDate.toISOString().split('T')[0];
      days.push(
        <DayCell
          key={dayString}
          day={dayDate}
          dayString={dayString}
          events={events.filter(event => event.date === dayString)}
          onClick={() => onDayClick(dayDate)}
          onEventClick={onEventClick}
        />
      );
    }

    return days;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const destDay = destination.droppableId;
    const destDate = new Date(destDay);

    // Only allow drop if destDay is in the current month
    if (
      destDate.getMonth() !== currentDate.getMonth() ||
      destDate.getFullYear() !== currentDate.getFullYear()
    ) {
      return; // Ignore drops outside the current month
    }

    const eventId = result.draggableId;
    const event = events.find(e => e.id === eventId);

    // Check for conflicts
    const newStart = new Date(destDay);
    newStart.setHours(new Date(event.start).getHours(), new Date(event.start).getMinutes());
    const newEnd = new Date(destDay);
    newEnd.setHours(new Date(event.end).getHours(), new Date(event.end).getMinutes());

    const hasConflict = events.some(e => {
      if (e.id === eventId) return false;
      return (newStart < new Date(e.end) && newEnd > new Date(e.start));
    });

    if (hasConflict) {
      alert('Event conflict detected!');
      return;
    }

    // Update event
    const updatedEvent = {
      ...event,
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
      date: destDay
    };
    updateEvent(eventId, updatedEvent);
  };

  return (
    <div className="calendar">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="calendar-grid">
          {renderDays()}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Calendar;
