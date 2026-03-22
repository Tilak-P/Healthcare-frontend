import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserMd, FaSignOutAlt, FaBell, FaBars, FaSearch, FaUserCircle } from 'react-icons/fa'

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16 border-b border-gray-200">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
          >
            <FaBars className="text-gray-600 text-lg" />
          </button>
          
          <div className="flex items-center gap-3">
            <FaUserMd className="text-primary-600 text-2xl" />
            <span className="text-xl font-bold text-gray-900 hidden md:inline">
              HealthCare
            </span>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search patients, doctors, appointments..."
            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Search */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <FaSearch className="text-gray-600" />
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <FaBell className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="font-medium text-gray-900">{user.name || 'Dr. John Doe'}</span>
              <span className="text-sm text-gray-500">{user.role || 'Administrator'}</span>
            </div>
            
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || 'D'}
                </div>
                <FaUserCircle className="text-gray-600 hidden md:block" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block animate-fade-in">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{user.name || 'Dr. John Doe'}</p>
                  <p className="text-sm text-gray-500">{user.email || 'doctor@hospital.com'}</p>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-gray-700">
                    My Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-gray-700">
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded hover:bg-red-50 text-red-600 flex items-center gap-2 mt-2"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header