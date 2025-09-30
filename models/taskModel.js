import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
        
    },
    description: {
        type: String,
        required: true
        
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
       
    },
    dueDate: {
        type: Date,
        
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;


