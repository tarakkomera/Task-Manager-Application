import Task from "../models/taskModel.js";

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate,completed } = req.body;
        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            completed: completed === 'true' || completed === true,
            owner: req.user._id
        });
        const saved = await task.save();
        res.status(201).json({ success: true, message: 'Task created successfully', task: saved });
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({success: true, tasks});
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

//Get a single task by ID

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
        if (!task) {
            return res.status(404).json({success: false ,message: 'Task not found' });
        }
        res.status(200).json({success: true,task});
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}
// Update a task by ID
export const updateTask = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.completed !== undefined) {
            data.completed = data.completed === 'Yes' || data.completed === true || data.completed === 'true';
        }

        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            data,
            { new: true,runValidators: true }
        );
        if (!updated) {
            
            return res.status(404).json({success: false, message: 'Task not found' });

        } 
        res.status(200).json({success: true, message: 'Task updated successfully', task: updated });
    }
    catch (error) {
                 res.status(500).json({success: false, message: error.message });
    }

};

// Delete a task by ID
export const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!deleted) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}; 