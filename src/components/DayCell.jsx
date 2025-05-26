import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const DayCell = ({ day, dayString, events, onClick, onEventClick }) => {
  const dayDate = new Date(day);
  const isToday = new Date().toDateString() === dayDate.toDateString();

  return (
    <Droppable
      droppableId={dayString}
      isDropDisabled={false}
      isCombineEnabled={false}
      ignoreContainerClipping={false}
    >
      {(provided) => (
        <div 
          className={`day-cell ${isToday ? 'today' : ''}`} 
          onClick={onClick} 
          ref={provided.innerRef} 
          {...provided.droppableProps}
        >
          <div className="day-number">{dayDate.getDate()}</div>
          {events.map((event, index) => (
            <Draggable key={event.id} draggableId={event.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="event"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  style={{
                    ...provided.draggableProps.style,
                    backgroundColor: event.color || '#e0e0e0'
                  }}
                >
                  <div className="event-title">{event.title}</div>
                  <div className="event-time">
                    {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DayCell;
