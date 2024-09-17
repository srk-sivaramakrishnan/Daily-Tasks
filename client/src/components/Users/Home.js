import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import baseURL from '../../connection/connection';
import '../../styles/Users/Home.css'; 

const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [username, setUsername] = useState('');

  const { id } = useParams(); // Get user ID from the URL

  useEffect(() => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      setGreeting('Good Morning');
    } else if (currentTime >= 12 && currentTime < 18) {
      setGreeting('Good Afternoon');
    } else if (currentTime >= 18 && currentTime < 21) {
      setGreeting('Good Evening');
    } else {
      setGreeting('Good Night');
    }

    // Fetch username from backend
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`${baseURL}/users/profile/${id}`);
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username', error);
      }
    };
  
    if (id) {
      fetchUsername();
    }
  }, [id]);

  return (
    <div>
      <h1>{`${greeting}, ${username}!`}</h1>
    </div>
  );
};

export default Home;
