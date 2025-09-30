import React, { useEffect, useState } from 'react'
import { LINK_CLASSES, menuItems, PRODUCTIVITY_CARD, SIDEBAR_CLASSES, TIP_CARD } from '../assets/dummy'
import { Lightbulb, Sparkle } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((t) => t.completed).length || 0
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const username = user?.name || "User"
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [mobileOpen])

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                LINK_CLASSES.base,
                isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
                isMobile ? "justify-start" : "lg:justify-items-start",
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>{icon}</span>
            <span className={`${isMobile ? "block" : "hidden lg:block"} ${LINK_CLASSES.text}`}>
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <>
    <div className={SIDEBAR_CLASSES.desktop}>
      <div className="p-3  border-b border-purple-100 lg:block hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-black font-bold shadow-md">
            {initial}
          </div>
          <div>
          <h3 className="text-lg font-bold text-gray-800">Hey, {username}</h3>
          <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
            <Sparkle className="w-3 h-3" /> Let's Crush Some tasks!
          </p>
        </div>
        </div>
      </div>

      <div className="p-1 space-y-6 overflow-auto flex-1">
        <div className={PRODUCTIVITY_CARD.container}>
          <div className={PRODUCTIVITY_CARD.header}>
            <h3 className={PRODUCTIVITY_CARD.label}>Productivity</h3>
            <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
          </div>
          <div className={PRODUCTIVITY_CARD.barBg}>
            <div className={PRODUCTIVITY_CARD.barFg} style={{ width: `${productivity}%` }} />
          </div>
        </div>
        {renderMenuItems()}
        <div className='mt-auto pt-6 lg:block hidden'>
          <div className={TIP_CARD.container}>
            <div className='flex items-center gap-2'>
            <div className={TIP_CARD.iconWrapper}>
              <Lightbulb className='w-5 h-5 text-green-600 to-blue-400' />
             </div>
            <div>
              <h3 className={TIP_CARD.title}>Pro Tip</h3>
              <p className={TIP_CARD.text}>Use Keyboard shortcuts to boost productivity</p>
            </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}

export default Sidebar