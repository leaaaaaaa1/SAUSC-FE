import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './ActivityList.css';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchActivities = async (search) => {
    try {
      const response = await fetch(`/api/v1/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: search }),
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      } else {
        console.error('Greška pri dohvaćanju aktivnosti');
      }
    } catch (error) {
      console.error('Greška pri povezivanju s API-em', error);
    }
  };

  const deleteActivity = async (idActivity) => {
    try {
      const response = await fetch(`/api/v1/activity/${idActivity}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // setActivities(
        //   activities.filter((activity) => activity.idActivity !== idActivity)
        // );
        navigate('/activities');
      } else {
        console.error('Greška pri brisanju aktivnosti');
      }
    } catch (error) {
      console.error('Greška pri povezivanju s API-em', error);
    }
  };

  useEffect(() => {
    fetchActivities('');
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchActivities(value);
  };

  return (
    <div className="activity-container">
      <h1 className="naslov">Popis aktivnosti</h1>
      <div className="button-row">
        <button className="home-button" onClick={() => navigate('/')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="right-buttons">
          <input
            type="text"
            className="search-input"
            placeholder="Pretraži aktivnosti"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="add-activity-button"
            onClick={() => navigate('/activities/new')}
          >
            Nova aktivnost
          </button>
        </div>
      </div>
      <table className="activity-list">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Opis</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.idActivity} className="activity-item">
              <td>{activity.name}</td>
              <td>{activity.description}</td>
              <td className="button-group">
                <button
                  className="edit-button"
                  onClick={() => navigate(`/activities/${activity.idActivity}`)}
                >
                  Uredi
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteActivity(activity.idActivity)}
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityList;
