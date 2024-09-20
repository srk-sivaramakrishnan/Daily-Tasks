import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './components/Pages/Index';
import Signup from './components/Pages/Signup';
import Signin from './components/Pages/Signin';
import Dashboard from './components/Pages/Dashboard';
import Home from './components/Users/Home';
import Tasks from './components/Users/Tasks';
import Profile from './components/Users/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard/:id" element={<Dashboard />}>
          <Route index element={<Home />} /> 
          <Route path="home" element={<Home />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
