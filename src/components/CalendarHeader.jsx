import React from 'react';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onMonthChange, onYearChange }) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Generate years (current year - 10 to current year + 10)
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handleMonthChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    onMonthChange(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    onYearChange(newDate);
  };

  return (
    <div className="calendar-header">
      <div className="month-navigation">
        <button onClick={onPrevMonth}>Previous</button>
        <div className="date-selectors">
          <select 
            value={currentDate.getMonth()} 
            onChange={handleMonthChange}
            className="month-select"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          <select 
            value={currentDate.getFullYear()} 
            onChange={handleYearChange}
            className="year-select"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button onClick={onNextMonth}>Next</button>
      </div>
      <div className="weekdays">
        {weekDays.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
