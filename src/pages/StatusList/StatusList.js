import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './StatusList.css';

const initialStatusData = {
  name: '',
  abbreviation: '',
};

const StatusList = () => {
  const [statuses, setStatuses] = useState([]);
  const [statusData, setStatusData] = useState(initialStatusData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatusId, setCurrentStatusId] = useState(null);

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`/api/v1/statuses`);
      if (response.ok) {
        const data = await response.json();
        setStatuses(data.statuses || []);
      } else {
        console.error('Greška pri dohvaćanju statusa');
      }
    } catch (error) {
      console.error('Greška pri povezivanju s API-em', error);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatusData({
      ...statusData,
      [name]: value,
    });
  };

  const saveStatus = async () => {
    const method = currentStatusId ? 'PUT' : 'POST';
    const url = currentStatusId
      ? `/api/v1/status/${currentStatusId}`
      : '/api/v1/status';

    console.log(statusData);
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      });

      if (response.ok) {
        const savedStatus = await response.json();
        if (currentStatusId) {
          setStatuses(
            statuses.map((status) =>
              status.idStatus === currentStatusId ? savedStatus : status
            )
          );
        } else {
          setStatuses([...statuses, savedStatus]);
        }
        setIsModalOpen(false);
        setStatusData(initialStatusData);
        setCurrentStatusId(null);
      }
    } catch (error) {
      console.error('Error saving status:', error);
    }
  };

  const editStatus = (status) => {
    setStatusData(status);
    setCurrentStatusId(status.idStatus);
    setIsModalOpen(true);
  };

  const deleteStatus = async (id) => {
    try {
      const response = await fetch(`/api/v1/status/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStatuses(statuses.filter((status) => status.idStatus !== id));
      }
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  return (
    <div className="status-list-container">
      <h1 className="status-list-naslov">Popis statusa</h1>
      <div className="status-list-button-row">
        <button
          className="status-list-add-button"
          onClick={() => {
            setIsModalOpen(true);
            setStatusData(initialStatusData);
            setCurrentStatusId(null);
          }}
        >
          Dodaj status
        </button>
      </div>
      <table className="status-list-table">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Šifra</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(statuses) ? (
            statuses.map((status) => (
              <tr key={status.idStatus} className="status-list-item">
                <td>{status.name}</td>
                <td>{status.abbreviation}</td>
                <td className="status-list-button-group">
                  {![1, 2, 3, 4].includes(status.idStatus) ? (
                    <>
                      <button
                        className="status-list-edit-button"
                        onClick={() => editStatus(status)}
                      >
                        Uredi
                      </button>
                      <button
                        className="status-list-delete-button"
                        onClick={() => deleteStatus(status.idStatus)}
                      >
                        Obriši
                      </button>
                    </>
                  ) : (
                    <span className="empty-actions">---</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No statuses available</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="status-list-modal"
        overlayClassName="status-list-overlay"
      >
        <h2 className="status-list-label">
          {currentStatusId ? 'Uredi status' : 'Dodaj novi status'}
        </h2>
        <div className="status-list-modal-content">
          <label>
            Naziv:
            <input
              type="text"
              name="name"
              value={statusData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Šifra:
            <input
              type="text"
              name="abbreviation"
              value={statusData.abbreviation}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="status-list-modal-buttons">
          <button className="status-list-save-button" onClick={saveStatus}>
            Spremi
          </button>
          <button
            className="status-list-back-button"
            onClick={() => setIsModalOpen(false)}
          >
            Otkaži
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StatusList;
