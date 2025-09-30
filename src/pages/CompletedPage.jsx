import { CheckCircle, SortAsc, SortDesc, Award, Filter } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import TaskItem from '../components/TaskItem';
import { useOutletContext } from 'react-router-dom';

const CT_CLASSES = {
  page: "p-4 md:p-6 min-h-screen overflow-hidden",
  header: "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4",
  titleWrapper: "flex-1 min-w-0",
  title: "text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2 truncate",
  subtitle: "text-xs md:text-sm text-gray-500 mt-1 ml-7 md:ml-8",
  sortContainer: "w-full md:w-auto mt-2 md:mt-0",
  sortBox: "flex items-center justify-between bg-white p-2 md:p-3 rounded-xl shadow-sm border border-purple-100 w-full md:w-auto",
  filterLabel: "flex items-center gap-2 text-gray-700 font-medium",
  select: "px-2 py-1 md:px-3 md:py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 md:hidden text-xs md:text-sm",
  btnGroup: "hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg ml-2 md:ml-3",
  btnBase: "px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1",
  btnActive: "bg-white text-purple-700 shadow-sm border border-purple-100",
  btnInactive: "text-gray-600 hover:text-purple-700 hover:bg-purple-100/50",
  list: "space-y-3 md:space-y-4",
  emptyState: "p-4 md:p-8 bg-white rounded-xl shadow-sm border border-purple-100 text-center",
  emptyIconWrapper: "w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4",
  emptyTitle: "text-base md:text-lg font-semibold text-gray-800 mb-2",
  emptyText: "text-xs md:text-sm text-gray-500",
};

const SORT_OPTIONS = [
  { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
  { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
  { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
];

const CompletedPage = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState('newest');

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter(task => ['yes', true, 1, 'true'].includes(
        typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
      ))
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'priority': {
            const order = { high: 3, medium: 2, low: 1 };
            return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()];
          }
          default:
            return 0;
        }
      });
  }, [tasks, sortBy]);

  return (
    <div className={CT_CLASSES.page}>
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}>
            <CheckCircle className='text-green-600 w-5 h-5 md:w-6 md:h-6' />
            <span className='truncate'>Completed Tasks</span>
          </h1>
          <p className={CT_CLASSES.subtitle}>
            {sortedCompletedTasks.length} task{sortedCompletedTasks.length !== 1 && 's'} marked as complete
          </p>
        </div>
        <div className={CT_CLASSES.sortContainer}>
          <div className={CT_CLASSES.sortBox}>
            <div className={CT_CLASSES.filterLabel}>
              <Filter className='w-4 h-4 text-green-500' />
              <span className='text-xs md:text-sm'>Sort by:</span>
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={CT_CLASSES.select}>
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <div className={CT_CLASSES.btnGroup}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={[
                    CT_CLASSES.btnBase,
                    sortBy === opt.id ? CT_CLASSES.btnActive : CT_CLASSES.btnInactive
                  ].join(" ")}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={CT_CLASSES.list}>
        {sortedCompletedTasks.length === 0 ? (
          <div className={CT_CLASSES.emptyState}>
            <CheckCircle className='w-6 h-6 md:w-8 md:h-8 text-green-600' />
            <h3 className={CT_CLASSES.emptyTitle}>No Completed Tasks yet!</h3>
            <p className={CT_CLASSES.emptyText}>Complete some tasks and they will show up here.</p>
          </div>
        ) : (
          sortedCompletedTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className='opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base'
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedPage;