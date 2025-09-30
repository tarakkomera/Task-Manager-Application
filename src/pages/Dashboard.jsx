import React, { useCallback, useMemo, useState } from 'react'

import { HomeIcon, Plus,Flame, Filter, CalendarIcon } from 'lucide-react'
import {useOutletContext} from 'react-router-dom'
import TaskModal from '../components/TaskModal'
import axios from 'axios'
import TaskItem from '../components/Taskitem'


const API_BASE = 'http://localhost:4000/api/tasks'

const Dashboard = () => {

  const {tasks, refreshTasks} = useOutletContext()
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [filter, setFilter] = useState("all")

  const stats = useMemo(() => ({
    total: tasks.length,
    lowPriority: tasks.filter(t => t.priority?.toLowerCase() === 'low').length,
    mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === 'medium').length,
    highPriority: tasks.filter(t => t.priority?.toLowerCase() === 'high').length,
    completed: tasks.filter(t => t.completed === true || t.completed === 1 || (
      typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes'
    )).length

  }), [tasks])


  const filteredTasks = useMemo(() => tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7)
    switch (filter){
      case "today":
        return dueDate.toDateString() === today.toDateString()
        case "week":
          return dueDate >= today && dueDate <= nextWeek;
        case "high":
        case "medium":
        case "low":
          return task.priority?.toLowerCase() === filter
        default:
          return true      

        }
  }),[tasks,filter])

  const handelTaskSave = useCallback(async(taskData) => {
    try{
      if (taskData.id) await axios.get(`${API_BASE}/${taskData.id}/gp`, taskData)
      refreshTasks()
      setShowModal(false)
      setSelectedTask(null)
    } catch(error){
         console.error("Error saving tasks:" , error)
    }
  },[refreshTasks])



  const STATS = [
    { key: "total", label: "Total Tasks", icon: HomeIcon, iconColor: "bg-purple-100 text-purple-600", valueKey: "total", gradient: true },
    { key: "lowPriority", label: "Low Priority", icon: Flame, iconColor: "bg-green-100 text-green-600", borderColor: "border-green-100", valueKey: "lowPriority", textColor: "text-green-600" },
    { key: "mediumPriority", label: "Medium Priority", icon: Flame, iconColor: "bg-orange-100 text-orange-600", borderColor: "border-orange-100", valueKey: "mediumPriority", textColor: "text-orange-600" },
    { key: "highPriority", label: "High Priority", icon: Flame, iconColor: "bg-red-100 text-red-600", borderColor: "border-red-100", valueKey: "highPriority", textColor: "text-red-600" },
]

  const EMPTY_STATE = {
    wrapper: "p-6 bg-white rounded-xl shadow-sm border border-purple-100 text-center",
    iconWrapper: "w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4",
    btn: "px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg text-sm font-medium",
}

const FILTER_OPTIONS = ["all", "today", "week", "high", "medium", "low"]

const FILTER_LABELS = {
  all: "All Tasks",
  today: "Today's Tasks",
  week: "This Week",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
  completed: "Completed Tasks",
};

 const FILTER_WRAPPER = "flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
 const SELECT_CLASSES = "px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 md:hidden text-sm"
 const TABS_WRAPPER = "hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg"
 const TAB_BASE = "px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
 const TAB_ACTIVE = "bg-white text-purple-700 shadow-sm border"
 const TAB_INACTIVE = "text-grey-600 hover:bg-purple-100/50"



   const WRAPPER = "p-4 md:p-6 min-h-screen overflow-hidden"
   const HEADER = "flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3"
   const ADD_BUTTON ="flex items-center gap bg-gradient-to-r from-green-500 to-blue-600 text-white px-10 py-1 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full md:w-auto justify-center text-sm md:text-base"
   const STATS_GRID = "grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6"
   const STAT_CARD ="p-3 md:p-4 rounded-xl bg-white shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 min-w-0"
   const ICON_WRAPPER = "p-1.5 md:p-2 rounded-lg"
   const VALUE_CLASS = "text-lg md:text-2xl font-bold truncate"
   const LABEL_CLASS = "text-xs text-grey-500 truncate"

  return (
    <div className={WRAPPER}>
      <div className={HEADER}>
        <div className='min-w-0'>
          <h1 className='text-xl md:text-xl font-bold text-grey-800 flex items-center gap-2'>
            <HomeIcon className='text-green-600 to-blue-500 w-5 h-5 md:w-6 md:h-6 shrink-0' />
            <span className=' truncate text-2xl '>Task Overview</span>
          </h1>
          <p className='text-sm text-grey-500 mt-1 ml-7  truncate'>Manage Your task efficiently</p>
        </div>
        <button onClick={() => setShowModal(true)} className={ADD_BUTTON}>
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      <div className={STATS_GRID}>
        {STATS.map(({
          key, label, icon: Icon, iconColor, 
          borderColor = "border-green-100",
          valueKey, textColor
        }) => (
          <div key={key} className={`${STAT_CARD} ${borderColor}`}>
            <div className='flex items-center gap-2 md:gap-3 '>
              <div className={`${ICON_WRAPPER} ${iconColor}`}>
                <Icon className='w-4 h-4 md:w-4 md:h-8 ' />
              </div>
              <div className='truncate'>
                <p className={LABEL_CLASS}>{label}</p>
                <p className={`text-lg font-semibold ${textColor || ''}`}>{stats[valueKey]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='space-y-6'>
        <div className={FILTER_WRAPPER}>
          <div className='flex items-center gap-2 min-w-0'>
            <Filter className='w-5 h-5 text-black shrink-0'/>
            <h2 className='text-base md:text-lg font-semibold text-grey-800 truncate'>
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={SELECT_CLASSES}>
            {FILTER_OPTIONS.map(opt => <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>)}
          </select>

          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>

            ))}
          </div>

        </div>
        <div className='space-y-4'>
          {filteredTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
               <CalendarIcon className='w-8 h-8 text-blue-500' />
               <h3 className='text-lg font-semibold text-grey-800 mb-2'>No tasks found</h3>
               <p className='text-sm text-grey-500 mb-4'>{filter === "all" ? "Create your first task to get started": "No tasks match this filter"}</p>
               <button onClick={() => setShowModal(true)} className={EMPTY_STATE.btn}>
                Add New Task
               </button>
            </div>
          ):(
            filteredTasks.map(task => (
              <TaskItem key={task._id || task.id}
              task={task} onRefresh = {refreshTasks} showCompleteCheckbox onEdit={() =>{setSelectedTask(task); setShowModal(true)}} />
            ))
         
          )}
        </div>
        <div onClick={() => setShowModal(true)}
        className='hidden md:flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-xl hover-border-green-400 bg-blue-50/50 cursor-pointer transition-colors'>
          <Plus className='w-5 h-5 text-blue-500 to-green-600 mr-2' />
          <span className='text-grey-600 font-medium '>Add New Task</span>
        </div>
      </div>
      <TaskModal isOpen={showModal || !!selectedTask}
      onClose={() => {setShowModal(false); setSelectedTask(null)}}
      taskToEdit={selectedTask}
      onSave={handelTaskSave}/>

    </div>
  )
}

export default Dashboard