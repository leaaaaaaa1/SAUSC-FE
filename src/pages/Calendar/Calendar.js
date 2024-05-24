import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/core/vdom';
import '@fullcalendar/common/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/daygrid/main.css';
import moment from 'moment';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [activityColors, setActivityColors] = useState({});
  const calendarRef = useRef(null);

  const generateColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const fetchReservations = async (startDate, endDate) => {
    try {
      const adjustedStart = moment(startDate).format('YYYY-MM-DD');
      const adjustedEnd = moment(endDate).format('YYYY-MM-DD');

      const response = await fetch('/api/v1/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: adjustedStart,
          endDate: adjustedEnd,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newActivityColors = { ...activityColors };

        const events = data.reservations.map((reservation) => {
          const activityName = reservation.activity.name;

          if (!newActivityColors[activityName]) {
            newActivityColors[activityName] = generateColor();
          }

          return {
            id: reservation.idReservation,
            title: activityName,
            start: reservation.startTime,
            end: reservation.endTime,
            description: `Price: ${reservation.reservationPrice} €, Member: ${reservation.sportsCenterMember.firstName} ${reservation.sportsCenterMember.lastName}`,
            backgroundColor: newActivityColors[activityName],
            borderColor: newActivityColors[activityName],
            extendedProps: {
              userId: reservation.sportsCenterMember.idUser,
            },
          };
        });

        setActivityColors(newActivityColors);
        setEvents(events);
      } else {
        console.error('Error fetching reservations');
      }
    } catch (error) {
      console.error('Error connecting to the API', error);
    }
  };

  useEffect(() => {
    const randomId = 1;
    localStorage.setItem('id', randomId);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const startDate = moment(calendarApi.view.currentStart)
        .startOf('day')
        .toISOString();
      const endDate = moment(calendarApi.view.currentEnd)
        .endOf('day')
        .toISOString();
      fetchReservations(startDate, endDate);
    }
  }, []);

  const handleDatesSet = (arg) => {
    const startDate = moment(arg.start).startOf('day').toISOString();
    const endDate = moment(arg.end).endOf('day').toISOString();
    fetchReservations(startDate, endDate);
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Kalendar rezervacija</h1>
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next',
          right: 'timeGridWeek',
        }}
        firstDay={1}
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        datesSet={handleDatesSet}
      />
    </div>
  );
};

export default Calendar;
