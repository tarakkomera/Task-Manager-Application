import React, { useEffect, useState } from 'react';
import { Pencil, Check, CheckCircle, MoreVertical,Edit2,Trash2, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { format, isToday } from 'date-fns';
import TaskModal from './TaskModal';


const API_BASE ='http://localhost:4000/api/tasks'


const MENU_OPTIONS = [
    { action: "edit", label: "Edit Task", icon: <Edit2 size={14} className="text-purple-600" /> },
    { action: "delete", label: "Delete Task", icon: <Trash2 size={14} className="text-red-600" /> },
]

const TI_CLASSES = {
    wrapper: "group p-4 sm:p-5 rounded-xl shadow-sm bg-white border-l-4 hover:shadow-md transition-all duration-300 border border-purple-100",
    leftContainer: "flex items-start gap-2 sm:gap-3 flex-1 min-w-0",
    completeBtn: "mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-full hover:bg-purple-100 transition-colors duration-300",
    checkboxIconBase: "w-4 h-4 sm:w-5 sm:h-5",
    titleBase: "text-base sm:text-lg font-medium truncate",
    priorityBadge: "text-xs px-2 py-0.5 rounded-full shrink-0",
    description: "text-sm text-gray-500 mt-1 truncate",
    subtasksContainer: "mt-3 sm:mt-4 space-y-2 sm:space-y-3 bg-purple-50/30 p-2 sm:p-3 rounded-lg border border-purple-100",
    progressBarBg: "h-1.5 bg-purple-100 rounded-full overflow-hidden",
    progressBarFg: "h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-300",
    rightContainer: "flex flex-col items-end gap-2 sm:gap-3",
    menuButton: "p-1 sm:p-1.5 hover:bg-purple-100 rounded-lg text-gray-500 hover:text-purple-700 transition-colors duration-200",
    menuDropdown: "absolute right-0 mt-1 w-40 sm:w-48 bg-white border border-purple-100 rounded-xl shadow-lg z-10 overflow-hidden animate-fadeIn",
    dateRow: "flex items-center gap-1.5 text-xs font-medium whitespace-nowrap",
    createdRow: "flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap",
}


const getPriorityColor = (priority) => {
    const colors = {
        low: "border-green-500 bg-green-50/50 text-green-700",
        medium: "border-purple-500 bg-purple-50/50 text-purple-600",
        high: "border-fuchsia-800 bg-fuchsia-50/50 text-fuchsia-800",
    }
    return colors[priority?.toLowerCase()] || "border-gray-500 bg-gray-50/50 text-gray-700"
}

const getPriorityBadgeColor = (priority) => {
    const colors = {
        low: "bg-green-100 text-green-900",
        medium: "bg-purple-100 text-purple-900",
        high: "bg-fuchsia-300 text-fuchsia-900",
    }
    return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-700"
}

const TaskItem = ({ task, onEdit, onRefresh, showCompleteCheckbox = true, onLogout }) => {

  const [showMenu, setShowMenu] = useState(false)
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, 'yes'].includes(
      typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
    )
  )

  const [showEditModal, setShowEditModal] = useState(false)
  const [subtasks, setSubtasks] = useState(task.subtasks || [])


  useEffect (() =>{
  setIsCompleted(
    [true,1,'yes'].includes(
      typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
    )
  )
} , [task.completed])

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
    if(!token) throw new Error("No Auth token found")
      return {Authorization: `Bearer ${token}`}
}


const borderColor = isCompleted ? 'border-green-500' : getPriorityColor(task.priority).split(" ")[0]

const handleComplete = async () => {
  const newStatus = isCompleted ;

  try {
    await axios.put(
      `${API_BASE}/${task._id}/gp`, // ✅ fixed from task.id
      { completed: newStatus },
      { headers: getAuthHeaders() }
    );

    setIsCompleted(!newStatus);
    onRefresh?.();
  } catch (err) {
    console.error(err);
    if (err.response?.status === 401) onLogout?.();
  }
};

const handleAction = (action) =>{
  setShowMenu(false)
  if(action === 'edit') setShowEditModal(true)
    if(action === 'delete') handelDelete()
}
const handelDelete = async () => {
  try {
    await axios.delete(`${API_BASE}/${task._id}/gp`, { headers: getAuthHeaders() });
    onRefresh?.();
  } catch (err) {
    if (err.response?.status === 401) onLogout?.();
  }
};



const handleSave = async (updatedTask) => {
  try {
    const payload = (({ title, description, priority, dueDate, completed }) => ({
      title,
      description,
      priority,
      dueDate,
      completed
    }))(updatedTask);

    await axios.put(`${API_BASE}/${task._id}/gp`, payload, { headers: getAuthHeaders() });
    setShowEditModal(false);
    onRefresh?.();
  } catch (err) {
    if (err.response?.status === 401) onLogout?.();
  }
};


return (
  <>
  <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
    <div className={TI_CLASSES.leftContainer}>
      {showCompleteCheckbox && (
        <button
          onClick={handleComplete}
          className={`${TI_CLASSES.completeBtn} ${isCompleted ? 'text-blue-500' : 'text-grey-300'}`}
        >
          <CheckCircle
            size={18}
            className={`${TI_CLASSES.checkboxIconBase} ${isCompleted ? 'fill-green-500' : ''}`}
          />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <h3
            className={`${TI_CLASSES.titleBase} ${
              isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>
          <span className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        {task.description && <p className={TI_CLASSES.description}>{task.description}</p>}
      </div>
    </div>

    <div className={TI_CLASSES.rightContainer}>
      <div className="relative">
        <button onClick={() => setShowMenu(!showMenu)} className={TI_CLASSES.menuButton}>
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" size={18} />
        </button>

        {showMenu && (
          <div className={TI_CLASSES.menuDropdown}>
            {MENU_OPTIONS.map((opt) => (
              <button
                key={opt.action}
                onClick={() => handleAction(opt.action)}
                className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200"
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className={`${TI_CLASSES.dateRow} ${task.dueDate && isToday(new Date(task.dueDate)) ? 'text-blue-600' : 'text-teal-400'}`}>
            <Calendar className='w-3.5 h-3.5' />
            {task.dueDate ? (isToday(new Date(task.dueDate)) ? 
               'Today' : format(new Date(task.dueDate), 'MMM dd')) : '-'}
        </div>
        <div className={`${TI_CLASSES.createdRow}`}>
        <Clock className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
            {task.createdAt ? `Created ${format(new Date(task.createdAt), 'MMM dd')}` : 'No date'}
        </div>

      </div>
    </div>
  </div>

  <TaskModal
    isOpen={showEditModal}
    taskToEdit={task}
    onSave={handleSave}
    onClose={() => setShowEditModal(false)}
  />
  </>
);
}
export default TaskItem;