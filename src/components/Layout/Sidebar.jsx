import {
  FaCalendarAlt,
  FaFileMedicalAlt,
  FaHospital,
  FaPhoneAlt,
  FaTachometerAlt,
  FaUserInjured,
  FaUserMd
} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/doctors', label: 'Doctors', icon: <FaUserMd /> },
    { path: '/patients', label: 'Patients', icon: <FaUserInjured /> },
    { path: '/medical-records', label: 'Medical Records', icon: <FaFileMedicalAlt /> },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-gradient-to-b from-primary-900 to-primary-800 
        text-white z-40 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:h-[calc(100vh-4rem)]
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-primary-700">
            <div className="flex items-center gap-3 mb-4">
              <FaHospital className="text-2xl" />
              <h2 className="text-xl font-bold">HealthCare</h2>
            </div>
            <p className="text-primary-200 text-sm">Medical Management System</p>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={closeSidebar}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-white text-primary-700 shadow-md font-semibold'
                        : 'hover:bg-primary-700 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-6 border-t border-primary-700">
            <div className="bg-red-500 bg-opacity-20 border border-red-400 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <FaPhoneAlt className="text-red-400 text-xl" />
                <h3 className="font-bold text-white">Emergency</h3>
              </div>
              <p className="text-sm text-red-100 mb-2">24/7 Emergency Services</p>
              <a
                href="tel:1234567890"
                className="block text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold transition-colors"
              >
                Call 123-456-7890
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar