import React, { useEffect , useMemo} from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom';
import { useState,useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import { Circle, Clock, TrendingUp, Zap, CheckCircle, Percent } from 'lucide-react';
const Layout =({ onLogout, user}) => {

const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);
const [err, setError] = useState(null);

const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null)

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const { data } = await axios.get('http://localhost:4000/api/tasks/gp', {
            headers: {Authorization: `Bearer ${token}`}
        }) 

        const arr = Array.isArray(data) ? data : Array.isArray(data?.tasks) ? data.tasks : Array.isArray(data?.data) ? data.data : [] 
        console.log("Fetched tasks from backend:", arr);
        setTasks(arr)
        }
        catch(err){
        console.error(err);
        setError(err.message || 'Something went wrong');
        if(err.response?.status === 401) onLogout();
        } finally {
        setLoading(false);
    }
}, [onLogout])

useEffect(() => { fetchTasks() }, [fetchTasks])

const stats = useMemo(() => {
const completeTasks = tasks.filter(t => t.completed === true || t.completed === 1 || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')).length
const totalCount = tasks.length;
const pendingCount = totalCount - completeTasks;
const completionPercentage = totalCount  ? Math.round((completeTasks / totalCount) * 100):0
return{
    totalCount,completeTasks,pendingCount,completionPercentage
}
}, [tasks])

const StatCard = ({ title, value, icon}) => (
    <div className='bg-white p-4 rounded-lg shadow-md flex items-center gap-4'>
        <div className='p-2 bg-blue-100 text-blue-600 rounded-full'>
            {icon}
        </div>
        <div>
            <p className='text-sm text-grey-500'>{title}</p>
            <p className='text-xl font-semibold'>{value}</p>
        </div>
    </div>
)

if(loading) return(
    <div className='min-h-screen flex items-center justify-center'>
    
        <div className='loader mb-4'>
        
    </div>
    </div>
)

if(err) return(
    <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
            <p className='text-red-600 mb-4'>Error Loading tasks</p>
            <p className='text-grey-600 mb-4'>{err}</p>
            <button onClick={fetchTasks} className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>Try Again</button>

        </div>
    </div>
)

  return (
    <div className='h-screen overflow-y-scroll no-scrollbar bg-gray-100 flex flex-col'>

        <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks ={tasks} />
      <div className='ml-0 xl-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300'>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6'>
            <div className='xl:col-span-2 space-y-3 sm:space-y-4'>
                <Outlet context={{tasks , refreshTasks: fetchTasks }} />
            </div>
            <div className='xl:col-end space-y-4 '>
                <div className='bg-white p-4 rounded-lg shadow-md'>
                    <h3 className='text-base font-semibold mb-4'>
                        <TrendingUp className='w-4 h-4 inline-block mr-2 text-blue-600 d-xl-flex ' />
                        Task Statistics
                    </h3>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <StatCard title="Total Tasks" value={stats.totalCount} icon={<Circle className='w-5 h-5' />} />
                        <StatCard title="Completed Tasks" value={stats.completeTasks} icon={<CheckCircle className='w-5 h-5 text-green-600' />} />
                        <StatCard title="Pending Tasks" value={stats.pendingCount} icon={<Clock className='w-5 h-5 text-yellow-600' />} />
                        <StatCard title="Completion Rate" value={`${stats.completionPercentage}%`} icon={<Percent className='w-5 h-5 text-purple-600' />} />

                    </div>
                    <hr className='my-4 sm:my-4 border-green-100' />
                    <div className='space-y-2 sm:space-y-3'>
                    <div className='flex items-center justify-between text-grey-700'>
                    <span className='text-xs sm:text-sm font-medium flex items-center gap-2'>
                        <Circle className='w-3 h-3 text-blue-600' />
                        Tasks progress
                    </span>
                    <span className='text-xs sm:text-sm font-medium text-grey-500'> 
                    {stats.completeTasks} / {stats.totalCount} 
                    </span>
                    </div>
                    <div className='relative pt-1'>
                        <div className='flex gap-2 items-center mb-1'>
                            <div className='flex-1 h-2 sm:h-3 bg-white rounded-full overflow-hidden'>
                                <div className='h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out' style={{ width: `${stats.completionPercentage}%` }}>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='text-xs text-grey-500'>
                    <h3 className='text-sm font-semibold mb-1'>
                        <Clock className='w-4 h-4 inline-block mr-2 text-yellow-600'/>
                        Recent Activity
                    </h3>

                    <div className='space-y-2 sm:space-y-3'>
                        {tasks.slice(0, 3).map(task => (
                            <div key={task.id || task._id} className='text-xs sm:text-sm'>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-grey-900 truncate'>{task.title}</p>
                                <p className='text-xs text-grey-500 truncate'>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'No data'}
                                </p>
                        </div>  
                        <span className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {task.completed ? 'Done' : 'Pending'}
                        </span>
                        </div>
                        ))}
                         {tasks.length === 0 && (
                            <div className='text-center text-grey-500'>
                            <div className='loader mb-2'>
                                <Clock className='w-6 h-6 text-yellow-600 animate-spin inline-block' />
                            </div>
                            <p className='text-sm' >No Recent Activity</p>
                            <p className='text-xs' >Tasks will Appear here</p>
                         </div>
                            
                            )}


                    </div>
                    </div>
                </div>
            </div>    
        </div>
      </div>
    </div>
    </div>
    
  )
}

export default Layout
