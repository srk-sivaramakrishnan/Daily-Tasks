import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './../../styles/Pages/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <nav className="sidenav">
        <ul>
          <li>
            <Link to="home">Home</Link>
          </li>
          <li>
            <Link to="tasks">Tasks</Link>
          </li>
          <li>
            <Link to="">Reports</Link>
          </li>
          <li>
            <Link to="">Profile</Link>
          </li>
          <li>
            <Link to="#">Logout</Link>
          </li>
        </ul>
      </nav>
      <main className="dashboard-content">
        <Outlet /> {/* This is where nested routes will render */}
      </main>
    </div>
  );
};

export default Dashboard;
