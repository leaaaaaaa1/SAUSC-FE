import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ActivityList from './pages/ActivityList/ActivityList';
import ActivityDetails from './pages/ActivityDetails/ActivityDetails';
import Header from './pages/Header/Header';
// import Home from './pages/Home/Home';
import StatusList from './pages/StatusList/StatusList';
import MyReservationList from './pages/MyReservationList/MyReservationList';
import ReservationDetails from './pages/ReservationDetails/ReservationDetails';
import './App.css';
import Calendar from './pages/Calendar/Calendar';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/activities" element={<ActivityList />} />
            <Route path="/activities/new" element={<ActivityDetails />} />
            <Route path="/activities/:id" element={<ActivityDetails />} />
            <Route path="/reservations" element={<MyReservationList />} />
            <Route path="/statuses" element={<StatusList />} />
            <Route path="/reservation/new" element={<ReservationDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
