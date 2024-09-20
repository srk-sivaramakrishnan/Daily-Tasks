import React from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import './../../styles/Pages/Dashboard.css';

const Dashboard = () => {
    const { id } = useParams(); 

  return (
    <div className="dashboard-container">
      <nav className="sidenav">
        <ul>
          <li>
            <Link to={`/dashboard/${id}/home`}>Home</Link>
          </li>
          <li>
            <Link to={`/dashboard/${id}/tasks`}>Tasks</Link>
          </li>
          <li>
            <Link to={`/dashboard/${id}/profile`}>Profile</Link>
          </li>
          <li>
            <Link to={`/dashboard/${id}/logout`}>Logout</Link>
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
