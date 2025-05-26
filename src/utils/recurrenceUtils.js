export const expandRecurringEvents = (event) => {
  const { start, end, recurrence } = event;
  const events = [];

  if (recurrence === 'none') {
    events.push(event);
    return events;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  const duration = endDate - startDate;

  let currentDate = new Date(startDate);
  const maxDate = new Date(startDate);
  maxDate.setMonth(maxDate.getMonth() + 1); // Limit to one month for simplicity

  while (currentDate < maxDate) {
    events.push({
      ...event,
      start: new Date(currentDate),
      end: new Date(currentDate.getTime() + duration),
    });

    switch (recurrence) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      default:
        break;
    }
  }

  return events;
};
