import React from 'react'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

const StatsCard = ({ title, value, icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    purple: 'border-purple-500',
    red: 'border-red-500',
  }

  const iconBgClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className={`card border-t-4 ${colorClasses[color]} hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
              trend.value > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trend.value > 0 ? (
                <FaArrowUp className="text-xs" />
              ) : (
                <FaArrowDown className="text-xs" />
              )}
              {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          <div className="text-2xl">{icon}</div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard