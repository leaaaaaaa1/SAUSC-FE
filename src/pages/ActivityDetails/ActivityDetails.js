import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import './ActivityDetails.css';

const initialActivityData = {
  name: '',
  description: '',
  pricePerHour: '',
  idUser: localStorage.getItem('idUser') || 1,
};

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== undefined;
  const [activityData, setActivityData] = useState(initialActivityData);
  const [equipment, setEquipment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEquipmentId, setCurrentEquipmentId] = useState(null);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    description: '',
    quantity: 1,
  });

  useEffect(() => {
    if (isEditing) {
      const fetchActivityData = async () => {
        try {
          const response = await fetch(`/api/v1/activity/${id}`);
          if (response.ok) {
            const data = await response.json();
            setActivityData({
              name: data.name,
              description: data.description,
              pricePerHour: data.pricePerHour,
            });
          } else {
            console.error('Greška pri dohvaćanju aktivnosti');
          }
        } catch (error) {
          console.error('Greška pri povezivanju s API-em', error);
        }
      };

      const fetchEquipment = async () => {
        try {
          const response = await fetch(`/api/v1/activity/${id}/equipment/list`);
          if (response.ok) {
            const data = await response.json();
            setEquipment(
              Array.isArray(data.equipmentList) ? data.equipmentList : []
            );
          } else {
            console.error('Greška pri dohvaćanju opreme');
          }
        } catch (error) {
          console.error('Greška pri povezivanju s API-em', error);
        }
      };

      fetchEquipment();
      fetchActivityData();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData({
      ...activityData,
      [name]: name === 'pricePerHour' ? parseFloat(value) : value,
    });
  };

  const handleEquipmentChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment({
      ...newEquipment,
      [name]: name === 'quantity' ? parseInt(value) : value,
    });
  };

  const saveChanges = async () => {
    const dataToSend = {
      name: activityData.name,
      description: activityData.description,
      pricePerHour: activityData.pricePerHour,
      idUser: activityData.idUser,
    };

    try {
      const response = await fetch(
        isEditing ? `/api/v1/activity/${id}` : `/api/v1/activity`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        console.log(
          isEditing ? 'Aktivnost ažurirana' : 'Nova aktivnost spremljena',
          dataToSend
        );
        navigate('/activities');
      } else {
        console.error('Greška pri spremanju aktivnosti');
      }
    } catch (error) {
      console.error('Greška pri povezivanju s API-em', error);
    }
  };

  const deleteActivity = async () => {
    try {
      const response = await fetch(`/api/v1/activity/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/activities');
      } else {
        console.error('Greška pri brisanju aktivnosti');
      }
    } catch (error) {
      console.error('Greška pri povezivanju s API-em', error);
    }
  };

  const addEquipment = () => {
    setIsModalOpen(true);
    setCurrentEquipmentId(null);
    setNewEquipment({ name: '', description: '', quantity: 1 });
  };

  const editEquipment = (equipmentId) => {
    const equipmentToEdit = equipment.find(
      (eq) => eq.idEquipment === equipmentId
    );
    setNewEquipment({
      name: equipmentToEdit.name,
      description: equipmentToEdit.description,
      quantity: equipmentToEdit.quantity,
    });
    setCurrentEquipmentId(equipmentId);
    setIsModalOpen(true);
  };

  const saveNewEquipment = async () => {
    try {
      const method = currentEquipmentId ? 'PUT' : 'POST';
      const url = currentEquipmentId
        ? `/api/v1/activity/${id}/equipment/${currentEquipmentId}`
        : `/api/v1/activity/${id}/equipment`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEquipment),
      });

      if (response.ok) {
        const savedEquipment = await response.json();
        if (currentEquipmentId) {
          setEquipment(
            equipment.map((eq) =>
              eq.idEquipment === currentEquipmentId ? savedEquipment : eq
            )
          );
        } else {
          setEquipment([...equipment, savedEquipment]);
        }
        setIsModalOpen(false);
        setNewEquipment({ name: '', description: '', quantity: 1 });
        setCurrentEquipmentId(null);
      } else {
        console.error('Greška pri spremanju opreme');
      }
    } catch (error) {
      console.error('Greška pri povezivanju s API-em', error);
    }
  };

  const deleteEquipment = async (equipmentId) => {
    try {
      const response = await fetch(
        `/api/v1/activity/${id}/equipment/${equipmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setEquipment(equipment.filter((eq) => eq.idEquipment !== equipmentId));
      } else {
        console.error('Greška pri brisanju opreme');
      }
    } catch (error) {
      console.error('Greška pri povezivanju s API-em', error);
    }
  };

  return (
    <div className="activity-details-container">
      <h1 className="naslov">
        {isEditing ? 'Detalji aktivnosti' : 'Nova aktivnost'}
      </h1>
      <div className="activity-info">
        <label>
          Naziv:
          <input
            type="text"
            name="name"
            value={activityData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Opis:
          <textarea
            name="description"
            value={activityData.description}
            onChange={handleChange}
            rows="4"
          />
        </label>
        <label>
          Cijena po satu:
          <input
            type="number"
            name="pricePerHour"
            step="0.01"
            value={activityData.pricePerHour}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="button-group">
        <button className="back-button" onClick={() => navigate('/activities')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button className="save-button" onClick={saveChanges}>
          Spremi
        </button>
        {isEditing && (
          <button className="delete-button" onClick={deleteActivity}>
            Obriši
          </button>
        )}
      </div>
      {isEditing && (
        <div className="oprema">
          <h2 className="naslov">Oprema</h2>
          <table className="equipment-list">
            <colgroup>
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Količina</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(equipment) &&
                equipment.map((eq) => (
                  <tr key={eq.idEquipment} className="equipment-item">
                    <td>{eq.name}</td>
                    <td>{eq.quantity}</td>
                    <td className="button-group">
                      <button
                        className="edit-button"
                        onClick={() => editEquipment(eq.idEquipment)}
                      >
                        Uredi
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteEquipment(eq.idEquipment)}
                      >
                        Obriši
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="add-button" onClick={addEquipment}>
            Dodaj opremu
          </button>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Dodaj novu opremu"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="labelEquipment">
          {currentEquipmentId ? 'Uredi opremu' : 'Dodaj novu opremu'}
        </h2>
        <div className="modal-content">
          <label>
            Naziv:
            <input
              type="text"
              name="name"
              value={newEquipment.name}
              onChange={handleEquipmentChange}
            />
          </label>
          <label>
            Opis:
            <textarea
              name="description"
              value={newEquipment.description}
              onChange={handleEquipmentChange}
              rows="4"
            />
          </label>
          <label>
            Količina:
            <input
              type="number"
              name="quantity"
              value={newEquipment.quantity}
              onChange={handleEquipmentChange}
            />
          </label>
        </div>
        <div className="modal-buttons">
          <button className="save-button" onClick={saveNewEquipment}>
            Spremi
          </button>
          <button className="back-button" onClick={() => setIsModalOpen(false)}>
            Otkaži
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ActivityDetails;
