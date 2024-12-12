// src/services/api.js
const API_URL = 'http://your-api-url.com/api';

export const fetchSchedules = async () => {
  const response = await fetch(`${API_URL}/schedules`);
  return response.json();
};

export const createSchedule = async (schedule) => {
  const response = await fetch(`${API_URL}/schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedule),
  });
  return response.json();
};

// Add similar functions for other entities (notifications, skill sets, etc.)