const homeModel = require('../models/homeModel');

// Controller to get user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await homeModel.findUserById(userId);
    if (user.length > 0) {
      res.status(200).json({ username: user[0].name });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to get today's tasks
exports.getTodaysTasks = async (req, res) => {
  const userId = req.params.id;
  const today = req.params.date;
  try {
    const tasks = await homeModel.getTodaysTasksByUserId(userId, today);
    const completedTasks = await homeModel.getCompletedTasksByUserId(userId, today);

    const tasksWithStatus = tasks.map(task => ({
      ...task,
      isCompleted: completedTasks.includes(task.id),
    }));

    res.status(200).json(tasksWithStatus);
  } catch (error) {
    console.error('Error fetching today\'s tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to mark a task as completed
exports.markTaskAsCompleted = async (req, res) => {
  const { taskId, userId } = req.body;
  const completedAt = new Date();

  try {
    await homeModel.markTaskCompleted(taskId, userId, completedAt, 'completed');
    res.status(200).json({ message: 'Task marked as completed' });
  } catch (error) {
    console.error('Error marking task as completed:', error);
    res.status(500).json({ error: 'Error marking task as completed' });
  }
};
