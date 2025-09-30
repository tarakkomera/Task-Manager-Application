import { Clock, ListChecks, SortDesc, SortAsc, Award, Filter, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/Taskitem';
import TaskModal from '../components/TaskModal';



const layoutClasses = {
    container: "p-6 min-h-screen overflow-hidden",
    headerWrapper: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4",
    sortBox: "flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-purple-100 w-full md:w-auto",
    select: "px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 md:hidden text-sm",
    tabWrapper: "hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg ml-3",
    tabButton: (active) =>
        `px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${active
            ? "bg-white text-purple-700 shadow-sm border border-purple-100"
            : "text-gray-600 hover:text-purple-700 hover:bg-purple-100/50"
        }`,
    addBox: "hidden md:block p-5 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 transition-colors cursor-pointer mb-6 bg-purple-50/50 group",
    emptyState: "p-8 bg-white rounded-xl shadow-sm border border-purple-100 text-center",
    emptyIconBg: "w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4",
    emptyBtn: "px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors",
};


 const WRAPPER = "p-4 md:p-6 min-h-screen overflow-hidden"
 const HEADER = "flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3"
 const ADD_BUTTON =
    "flex items-center gap bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-10 py-1 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full md:w-auto justify-center text-sm md:text-base"
 const SORT_OPTIONS = [
    { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
    { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
    { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
];



const API_BASE ='http://localhost:4000/api/tasks'



const PendingPage = () => {
  const {tasks = [], refreshTasks} = useOutletContext();
  const [sortBy, setSortBy,] = useState('newest')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)


  const getAuthHeaders = () => {
    const token =localStorage.getItem('token')
    if (!token) throw new Error("No auth token found")
      return {'Content Type' : 'appliction/json',Authorization : `Bearer ${token}`}
  }

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) => !t.completed || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'no')
    )
    return filtered.sort((a,b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) -  new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) -  new Date(b.createdAt);
      const order = {high: 3, medium: 2, low :1}
      return order[b.priority.toLowerCase()] - order[a.priority.toLowerCase()]
    })
  }, [tasks, sortBy])

  // Add handleDelete function
  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete task');
      refreshTasks();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete task');
    }
  };

  // Add handleToggleComplete function
  const handleToggleComplete = async (taskId, currentCompleted) => {
    try {
      const updatedCompleted =
        typeof currentCompleted === 'string'
          ? currentCompleted.toLowerCase() === 'yes'
            ? 'no'
            : 'yes'
          : !currentCompleted;
      const res = await fetch(`${API_BASE}/${taskId}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: updatedCompleted }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      refreshTasks();
    } catch (err) {
      console.error('Toggle complete error:', err);
      alert('Failed to update task');
    }
  };
  
    

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
      <div>
        <h1 className='text 2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
          <ListChecks className=' text-blue-500' /> Pending Task
        </h1>
        <p className='text-sm text-gray-400 ,t-1 ml-7'>
          {sortedPendingTasks.length} task {sortedPendingTasks.length !== 1 && 's'} {' '}
          needing your attention
        </p>
      </div>
      <div className={layoutClasses.sortBox}>
        <div className='flex items-center gap-2 text-gray-700 font-medium'>
          <Filter className ='w-4 h-4 text-blue-600' />
          <span className='text-sm'>Sort by:</span>
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
        className={layoutClasses.select}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">By Priority</option>
        </select>
        <div className={layoutClasses.tabWrapper}>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setSortBy(opt.id)}
            className={layoutClasses.tabButton(sortBy === opt.id)}>
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>
      </div>
      <div className={layoutClasses.addBox} onClick={() => setShowModal(true)}>
        <div className='flex items-center justify-center gap-3 text-gray-500 group-hover:text-blue-600 transition-colors'>
          <div className='w-8 h-8 rounded-full bg-white flex items-center justify-centershadow-sm group-hover:shadow-md transition-colors duration-200'>
            <Plus className = 'text-green-700' size={18} />

          </div>
          <span className='font-medium'>
            Add New Task
          </span>
        </div>
      </div>
      <div className='space-y-4'>
        {sortedPendingTasks.length === 0 ? (
          <div className={layoutClasses.emptyState}>
          <div className='max-w-xs mx-auto py-6'>
          <div className={layoutClasses.emptyIconBg}>
            <Clock className='w-8 h-8 text-green-500'/>

          </div>
          <h3 className='text-lg font-semibold text-grey-800 mb-2'>
            All Caught up!
          </h3>
          <p className='text-sm text-gray-500 mb-4'>
            No Pending tasks - Great Work!
          </p>
          <button onClick={() => setShowModal(true)}
          className={layoutClasses.emptyBtn}>Create New Task</button>
          </div>
          </div>
        ):(
          sortedPendingTasks.map(task => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              showCompletedCheckbox
              onDelete={() => handleDelete(task._id || task.id)}
              onToggleCompleted={() => handleToggleComplete(
                task._id || task.id, task.completed
              )}
              onEdit={() => { setSelectedTask(task); setShowModal(true); }}
              onRefresh={refreshTasks}
            />
          ))
        )}
        <TaskModal isOpen={!!selectedTask || showModal}
        onClose={() => {setShowModal(false) ; setSelectedTask(null); refreshTasks();}}
        taskToEdit={selectedTask} />
      </div>
    </div>
  )
}

export default PendingPage
