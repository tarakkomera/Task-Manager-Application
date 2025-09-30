import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, Zap } from 'lucide-react';

function Navbar({ user, onLogout }) {
  const menuref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handleClickOutside = (event) =>{
      if(menuref.current && !menuref.current.contains(event.target)){
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedom", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    setMenuOpen(false);
    if (onLogout) onLogout();
  };

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuref.current && !menuref.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className='sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-grey-200 font-sans'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        {/* Logo or Brand Name */}
        <div
          className='flex items-center gap-2 cursor-pointer group'
          onClick={() => navigate('/')}
        >
          <div className='relative w-15 h-15 flex items-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 justify-center text-white font-bold text-xl'>
            <Zap className='w-7 h-7 text-black' />
            <div className='absolute w-7 h-7 rounded-full bg-white top-0 -right-1 flex items-center justify-center text-blue-600 text-xs font-bold shadow-md group-hover:scale-110 transition-all duration-100'></div>
            <span className='absolute w-7 h-7 rounded-full bg-white bottom-8 -right-2 flex items-center justify-center text-green-600 text-xs font-bold shadow-md group-hover:scale-110 transition-all duration-100'>
              Qubic
            </span>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <button
            className='px-2 py-1 rounded-md bg-gradient-to-tr from-blue-600 to-purple-600 text-white text-sm font-semibold hover:scale-105 transition-all duration-100'
            onClick={() => navigate('/profile')}
          >
            <Settings className='w-5 h-5 inline-block mr-1' />
            Profile
          </button>

          <div ref={menuref} className='relative'>
            <button
              onClick={handleMenuToggle}
              className='flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:scale-105 transition-all duration-100 border border-grey-300'
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-controls="user-menu"
            >
              <div className='relative'>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt='User Avatar'
                    className='w-8 h-8 rounded-full shadow-sm'
                  />
                ) : (
                  <div className='w-8 h-8 rounded-full bg-grey-300 flex items-center justify-center text-grey-600 font-bold'>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse'></div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-grey-600 ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen && (
              <ul
                id="user-menu"
                className='absolute right-0 mt-2 w-48 bg-white border border-grey-200 rounded-md shadow-lg z-50'
              >
                <li className='px-4 py-2 hover:bg-grey-100 cursor-pointer'>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/profile');
                    }}
                    className='flex items-center w-full text-sm'
                  >
                    <Settings className='w-4 h-4 inline-block mr-2' />
                    Profile Settings
                  </button>
                </li>
                <li className='px-4 py-2 hover:bg-grey-100 cursor-pointer'>
                  <button
                    onClick={handleLogout}
                    className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100'
                  >
                    <LogOut className='w-4 h-4' />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;