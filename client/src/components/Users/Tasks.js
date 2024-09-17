import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import axios from 'axios';
import baseURL from '../../connection/connection';
import '../../styles/Users/Tasks.css'; 

const Tasks = () => {
  const { id: user_id } = useParams(); // Extract user_id from URL parameters
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false); // State for bulk upload modal
  const [taskData, setTaskData] = useState({
    date: '',
    day: '',
    from_time: '',
    to_time: '',
    task: '',
    user_id // Include user_id in taskData
  });
  const [csvFile, setCsvFile] = useState(null); // State to store the selected CSV file

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value
    });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/users/tasks/add`, taskData);
      alert('Task added successfully');
      setIsModalOpen(false); // Close modal on successful submission
    } catch (error) {
      console.error('Error adding task', error);
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
      await axios.post(`${baseURL}/users/tasks/upload/${user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Bulk tasks uploaded successfully');
      setIsBulkModalOpen(false); // Close modal on successful upload
    } catch (error) {
      console.error('Error uploading CSV file', error);
    }
  };

  return (
    <div>
      <h1>Tasks</h1>
      <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>Add Task</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Add Task</h2>
            <form onSubmit={handleTaskSubmit}>
              <input type="date" name="date" value={taskData.date} onChange={handleInputChange} required placeholder="Date" />
              <input type="text" name="day" value={taskData.day} onChange={handleInputChange} required placeholder="Day" />
              <input type="time" name="from_time" value={taskData.from_time} onChange={handleInputChange} placeholder="From Time" />
              <input type="time" name="to_time" value={taskData.to_time} onChange={handleInputChange} placeholder="To Time" />
              <textarea name="task" value={taskData.task} onChange={handleInputChange} required placeholder="Enter your task"></textarea>
              <button type="submit">Add Task</button>
              <div className="bulk-task-link">
                <button className="bulk-link-btn" type="button" onClick={() => setIsBulkModalOpen(true)}>Click here to add bulk tasks</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBulkModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setIsBulkModalOpen(false)}>&times;</span>
            <h2>Bulk Upload Instructions</h2>
            <p>1. Download CSV File.</p>
            <p>2. Fill your tasks in that CSV.</p>
            <p>3. Save the CSV File and click upload task to upload your bulk tasks.</p>
            <div className="bulk-upload-actions">
              <button onClick={handleDownloadCSV} className="bulk-action-btn">Download CSV File</button>
              <input type="file" accept=".csv" className="bulk-upload-file" onChange={handleFileChange} />
              <button className="bulk-action-btn" onClick={handleBulkUpload}>Upload CSV File</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
