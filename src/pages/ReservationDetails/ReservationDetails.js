import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import './ReservationDetails.css';

const ReservationDetails = () => {
  const [activities, setActivities] = useState([]);
  const [availableStartTimes, setAvailableStartTimes] = useState([]);
  const [availableEndTimes, setAvailableEndTimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    numberOfParticipants: '',
    sportsCenterMemberId: localStorage.getItem('id') || '',
    idActivity: '',
    idStatus: 1,
    startDate: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/v1/activities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: '' }),
        });

        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities || []);
        } else {
          console.error('Error fetching activities');
        }
      } catch (error) {
        console.error('Error connecting to the API', error);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchAvailableStartTimes = async () => {
      const { idActivity, startDate } = formData;
      if (idActivity && startDate) {
        try {
          const response = await fetch('/api/v1/reservation/available-start-times', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: startDate, idActivity }),
          });

          if (response.ok) {
            const data = await response.json();
            setAvailableStartTimes(data.possibleTimes || []);
          } else {
            console.error('Error fetching available start times');
          }
        } catch (error) {
          console.error('Error connecting to the API', error);
        }
      }
    };

    fetchAvailableStartTimes();
  }, [formData.idActivity, formData.startDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'idActivity' || name === 'startDate') {
      setAvailableStartTimes([]);
      setAvailableEndTimes([]);
      setFormData((prevFormData) => ({
        ...prevFormData,
        startTime: '',
        endTime: '',
      }));
    }
  };

  const handleStartTimeChange = async (e) => {
    const selectedStartTime = e.target.value;
    const { idActivity, startDate } = formData;

    setFormData({
      ...formData,
      startTime: `${startDate}T${selectedStartTime}`,
    });

    if (idActivity && startDate && selectedStartTime) {
      try {
        const response = await fetch(
          '/api/v1/reservation/available-end-times',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              startDate: startDate,
              idActivity,
              startTime: selectedStartTime,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAvailableEndTimes(data.possibleTimes || []);
        } else {
          console.error('Error fetching available end times');
        }
      } catch (error) {
        console.error('Error connecting to the API', error);
      }
    }
  };

  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;
    setFormData({
      ...formData,
      endTime: `${formData.startDate}T${selectedEndTime}`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await fetch('/api/v1/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Reservation created successfully');
        navigate('/reservations');
      } else if (response.status === 400) {
        setIsModalOpen(true);
      } else {
        console.error('Error creating reservation');
      }
    } catch (error) {
      console.error('Error connecting to the API', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="new-reservation-container">
      <h1 className="new-reservation-title">Nova Rezervacija</h1>
      <form className="new-reservation-form" onSubmit={handleSubmit}>
        <label>
          Aktivnost:
          <select
            name="idActivity"
            value={formData.idActivity}
            onChange={handleChange}
            required
          >
            <option value="">Odaberi aktivnost</option>
            {activities.length > 0 &&
              activities.map((activity) => (
                <option key={activity.idActivity} value={activity.idActivity}>
                  {activity.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          Dan početka:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={today}
            required
          />
        </label>
        <label>
          Vrijeme početka:
          <select
            name="startTime"
            value={formData.startTime.split('T')[1] || ''}
            onChange={handleStartTimeChange}
            disabled={!formData.startDate || !formData.idActivity}
            required
          >
            <option value="">Odaberi vrijeme početka</option>
            {availableStartTimes.length > 0 &&
              availableStartTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
          </select>
        </label>
        <label>
          Vrijeme završetka:
          <select
            name="endTime"
            value={formData.endTime.split('T')[1] || ''}
            onChange={handleEndTimeChange}
            disabled={!formData.startTime}
            required
          >
            <option value="">Odaberi vrijeme završetka</option>
            {availableEndTimes.length > 0 &&
              availableEndTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
          </select>
        </label>
        <label>
          Broj sudionika:
          <input
            type="number"
            name="numberOfParticipants"
            value={formData.numberOfParticipants}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="submit-button">
          Spremi
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate('/reservations')}
        >
          Otkaži
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="new-reservation-modal"
        overlayClassName="new-reservation-overlay"
      >
        <h2 className="modal-title">Termin je već zauzet, odaberite novi</h2>
        <button
          className="modal-button"
          onClick={() => window.location.reload()}
        >
          U redu
        </button>
      </Modal>
    </div>
  );
};

export default ReservationDetails;
