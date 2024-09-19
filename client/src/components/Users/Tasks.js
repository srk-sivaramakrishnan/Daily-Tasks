import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../connection/connection';
import '../../styles/Users/Tasks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// Helper function to format date from yyyy-mm-dd to dd-mm-yyyy
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to format time from HH:MM to 12-hour format with AM/PM
const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;
  return `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
};

const Tasks = () => {
  const { id: user_id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    date: '',
    day: '',
    from_time: '',
    to_time: '',
    task: '',
    user_id
  });
  const [editTaskData, setEditTaskData] = useState({
    id: '',
    from_time: '',
    to_time: '',
    task: '',
  });
  const [csvFile, setCsvFile] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${baseURL}/tasks/tasks/${user_id}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };

    fetchTasks();
  }, [user_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditTaskData({
      ...editTaskData,
      [name]: value
    });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/tasks/tasks/add`, taskData);
      alert('Task added successfully');
      setIsModalOpen(false);
      const response = await axios.get(`${baseURL}/tasks/tasks/${user_id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/tasks/tasks/${editTaskData.id}`, editTaskData);
      alert('Task updated successfully');
      setEditModalOpen(false);
      const response = await axios.get(`${baseURL}/tasks/tasks/${user_id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${baseURL}/tasks/tasks/${taskId}`);
      alert('Task deleted successfully');
      const response = await axios.get(`${baseURL}/tasks/tasks/${user_id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleDownloadCSV = () => {
    window.location.href = '/task-template.csv';
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleBulkUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      await axios.post(`${baseURL}/tasks/tasks/upload/${user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Bulk tasks uploaded successfully');
      setShowBulkUpload(false);
      const response = await axios.get(`${baseURL}/tasks/tasks/${user_id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error uploading CSV file', error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date === selectedDate ? null : date);
  };

  const openEditModal = (task) => {
    setEditTaskData({
      id: task.id,
      from_time: task.from_time,
      to_time: task.to_time,
      task: task.task,
    });
    setEditModalOpen(true);
  };

  const renderTasks = () => {
    const groupedTasks = tasks.reduce((acc, task) => {
      if (!acc[task.date]) {
        acc[task.date] = [];
      }
      acc[task.date].push(task);
      return acc;
    }, {});

    return Object.keys(groupedTasks).map((date) => (
      <div key={date} className="task-date-box">
        <h2 onClick={() => handleDateClick(date)} className="task-date-header">
          {formatDate(date)} -- {groupedTasks[date][0].day}
        </h2>
        {selectedDate === date && (
          <div className="task-details-container">
            {groupedTasks[date].map((task) => (
              <div key={task.id} className="task-box">
                <p><strong>From:</strong> {formatTime(task.from_time)}</p>
                <p><strong>To:</strong> {formatTime(task.to_time)}</p>
                <p><strong>Task:</strong> {task.task}</p>
                <div className="task-icons">
                  <FontAwesomeIcon icon={faEdit} onClick={() => openEditModal(task)} />
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteTask(task.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (

    <div style={{ position: 'relative' }}>
      <h1>Tasks</h1>
      <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>Add Task</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Add Task</h2>
            <form onSubmit={handleTaskSubmit}>
              <input type="date" name="date" value={taskData.date} onChange={handleInputChange} required />
              <input type="text" name="day" value={taskData.day} onChange={handleInputChange} required />
              <input type="time" name="from_time" value={taskData.from_time} onChange={handleInputChange} />
              <input type="time" name="to_time" value={taskData.to_time} onChange={handleInputChange} />
              <textarea name="task" value={taskData.task} onChange={handleInputChange} required></textarea>
              <button type="submit">Add Task</button>
              <button type="button" onClick={() => setShowBulkUpload(!showBulkUpload)}>
                {showBulkUpload ? 'Hide Bulk Upload' : 'Click here to add bulk tasks'}
              </button>
              {showBulkUpload && (
                <div>
                  <button onClick={handleDownloadCSV}>Download CSV File</button>
                  <input type="file" accept=".csv" onChange={handleFileChange} />
                  <button onClick={handleBulkUpload}>Upload CSV File</button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setEditModalOpen(false)}>&times;</span>
            <h2>Edit Task</h2>
            <form onSubmit={handleEditTaskSubmit}>
              <input type="time" name="from_time" value={editTaskData.from_time} onChange={handleEditInputChange} />
              <input type="time" name="to_time" value={editTaskData.to_time} onChange={handleEditInputChange} />
              <textarea name="task" value={editTaskData.task} onChange={handleEditInputChange} required></textarea>
              <button type="submit">Update Task</button>
            </form>
          </div>
        </div>
      )}

      <div className="tasks-container">
        {renderTasks()}
      </div>
    </div>
  );
};

export default Tasks;
