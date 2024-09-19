import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import baseURL from '../../connection/connection';
import '../../styles/Users/Home.css';

// Helper function to format time in 12-hour format
const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;
  return `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
};

const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]);
  const { id } = useParams(); // Get user ID from the URL

  useEffect(() => {
    const updateGreeting = () => {
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
    };

    const fetchUsername = async () => {
      try {
        const response = await axios.get(`${baseURL}/home/profile/${id}`);
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username', error);
      }
    };

    const fetchTodaysTasks = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const response = await axios.get(`${baseURL}/home/tasks/${id}/${today}`);
        const sortedTasks = sortTasks(response.data);
        setTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching today's tasks", error);
      }
    };

    if (id) {
      updateGreeting();
      fetchUsername();
      fetchTodaysTasks();
    }
  }, [id]);

  // Sort tasks so completed tasks are at the bottom
  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.isCompleted === b.isCompleted) return 0;
      return a.isCompleted ? 1 : -1; // Move completed tasks to the bottom
    });
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await axios.post(`${baseURL}/home/tasks/complete`, {
        taskId: taskId,
        userId: id,
      });

      // Update task status in the state
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: true } : task
      );
      setTasks(sortTasks(updatedTasks)); // Resort tasks after marking one as completed
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };

  return (
    <div className="home-container">
      <h1>{`${greeting}, ${username}!`}</h1>
      <h2>Today's Tasks:</h2>
      <div className="tasks-container">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-box ${task.isCompleted ? 'completed-task' : ''}`}
            >
              <p><strong>From:</strong> {formatTime(task.from_time)}</p>
              <p><strong>To:</strong> {formatTime(task.to_time)}</p>
              <p><strong>Task:</strong> {task.task}</p>
              {!task.isCompleted && (
                <button
                  className="complete-btn"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  Mark as Complete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No tasks for today!</p>
        )}
      </div>
    </div>
  );
};

export default Home;
