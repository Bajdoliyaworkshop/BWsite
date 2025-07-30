import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaClock, FaRupeeSign, FaBookOpen, FaSignInAlt, FaSpinner } from 'react-icons/fa'

export default function ServiceCard({ 
  service, 
  selectedCar, 
  date,
  onBookNow,
  isBooking,
  activeService
}) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const durationText = service.duration >= 60 
    ? `${Math.floor(service.duration / 60)}h ${service.duration % 60}m`
    : `${service.duration}m`

  const handleLoginRedirect = () => {
    toast.info('Please login to book services')
    navigate('/login', { state: { from: 'service-booking' } }) 
  }

  return (
    <div 
      className={`bg-white p-5 rounded-xl shadow-sm transition-all duration-300 border border-gray-100 ${
        isHovered ? 'md:transform md:-translate-y-1 md:shadow-md' : ''
      } hover:border-red-100`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Service Header */}
      <div className="flex items-start mb-4">
        <div className="bg-red-50 p-3 rounded-xl mr-4 flex-shrink-0">
          <img 
            src={`https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/xxxhdpi/${service.iconId || 7}.png`} 
            alt={service.name}
            className="w-10 h-10 object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 truncate">{service.name}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{service.description}</p>
        </div>
      </div>
      
      {/* Price and Duration */}
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <div className="flex items-center">
            <FaRupeeSign className="text-red-500 mr-1 flex-shrink-0" />
            <span className="text-lg font-bold text-gray-800">₹{service.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FaClock className="mr-1 text-red-400 flex-shrink-0" />
            <span>{durationText}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        {user ? (
          <button
            onClick={() => onBookNow(service._id)}
            disabled={!selectedCar || !date || isBooking}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-white font-medium ${
              (!selectedCar || !date || isBooking) 
                ? 'bg-red-300 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
            } transition-colors shadow-sm active:shadow-inner`}
          >
            {isBooking && activeService === service._id ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                <span>Booking...</span>
              </>
            ) : (
              <>
                <FaBookOpen className="mr-2" />
                <span>Book Now</span>
              </>
            )}
          </button>
        ) : (
          <button 
            onClick={handleLoginRedirect} 
            className="w-full py-3 px-4 rounded-xl text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors flex items-center justify-center font-medium shadow-sm active:shadow-inner"
          >
            <FaSignInAlt className="mr-2" />
            <span>Login to Book</span>
          </button>
        )}
      </div>
    </div>
  )
}