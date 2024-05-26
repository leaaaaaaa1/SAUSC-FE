import React, { useState, useEffect } from 'react';
import './MyReservationList.css';
import { useNavigate } from 'react-router-dom';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    const userId = localStorage.getItem('id');
    
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }

    try {
      const response = await fetch(`/api/v1/reservations/${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setReservations(data.reservations);
      } else {
        console.error('Error fetching reservations');
      }
    } catch (error) {
      console.error('Error connecting to the API', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const deleteReservation = async (idReservation) => {
    try {
      console.log(JSON.stringify({ idStatus: 3 }));
      const response = await fetch(`/api/v1/reservation/${idReservation}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idStatus: 3 }),
      });

      if (response.ok) {
        fetchReservations();
        navigate('/reservations');
      } else {
        console.error('Error deleting reservation');
      }
    } catch (error) {
      console.error('Error connecting to the API', error);
    }
  };

  const isFutureReservation = (endTime) => {
    return new Date(endTime) > new Date();
  };

  return (
    <div className="reservation-list-container">
      <h1 className="reservation-list-naslov">Popis rezervacija</h1>
      <button
        className="new-reservation-button"
        onClick={() => navigate('/reservation/new')}
      >
        Nova Rezervacija
      </button>
      <div className="reservation-list-grid">
        {reservations.map((reservation) => (
          <div key={reservation.idReservation} className="reservation-card">
            <h2>Rezervacija #{reservation.idReservation}</h2>
            <p>
              <span className="highlight">Početak:</span>{' '}
              {new Date(reservation.startTime).toLocaleString()}
            </p>
            <p>
              <span className="highlight">Završetak:</span>{' '}
              {new Date(reservation.endTime).toLocaleString()}
            </p>
            <p>
              <span className="highlight">Cijena:</span>{' '}
              {reservation.reservationPrice} €
            </p>
            <p>
              <span className="highlight">Aktivnost:</span>{' '}
              {reservation.activity.name}
            </p>
            <p>
              <span className="highlight">Status:</span>{' '}
              {reservation.status ? reservation.status.name : 'N/A'}
            </p>

            <div className="reservation-card-actions">
              {isFutureReservation(reservation.endTime) && reservation.status.idStatus === 1 &&(
                <button
                  className="reservation-card-delete-button"
                  onClick={() => deleteReservation(reservation.idReservation)}
                >
                  Otkaži
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
