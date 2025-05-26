import { useState } from 'react';

const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return { currentDate, goToPrevMonth, goToNextMonth, setCurrentDate };
};

export default useCalendar;
