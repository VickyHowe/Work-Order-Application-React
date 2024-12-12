import React, { useEffect, useState } from 'react';
import { fetchSchedules, createSchedule } from '../../services/api';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({});

  useEffect(() => {
    const loadSchedules = async () => {
      const data = await fetchSchedules();
      setSchedules(data);
    };
    loadSchedules();
  }, []);

  const handleCreateSchedule = async () => {
    const createdSchedule = await createSchedule(newSchedule);
    setSchedules([...schedules, createdSchedule]);
    setNewSchedule({});
  };

  return (
    <div className="p-4">
      <h2 className="text-xl">Schedule</h2>
      <div>
        <input
          type="text"
          placeholder="New Schedule"
          value={newSchedule.name || ''}
          onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
        />
        <button onClick={handleCreateSchedule}>Create Schedule</button>
      </div>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.id}>{schedule.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;