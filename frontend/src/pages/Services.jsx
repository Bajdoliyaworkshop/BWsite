import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import * as bookingService from '../services/booking';
import { toast } from 'react-toastify';
import ServiceCard from '../components/services/ServiceCard';
import { 
  FaCar, 
  FaCalendarAlt, 
  FaSpinner, 
  FaOilCan,
  FaCarBattery,
  FaCarCrash,
  FaCarSide,
  FaGasPump,
  FaTint,
  FaTools
} from 'react-icons/fa';
import { GiCarWheel, GiCarKey } from 'react-icons/gi';

export default function Services() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await bookingService.getServices();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        toast.error('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getServiceIcon = (serviceType) => {
    if (!serviceType) return <FaTools className="text-2xl" />;
    
    const type = serviceType.toLowerCase();
    if (type.includes('oil')) return <FaOilCan className="text-2xl" />;
    if (type.includes('battery')) return <FaCarBattery className="text-2xl" />;
    if (type.includes('tire') || type.includes('tyre') || type.includes('wheel')) return <GiCarWheel className="text-2xl" />;
    if (type.includes('wash')) return <FaTint className="text-2xl" />;
    if (type.includes('fuel') || type.includes('gas')) return <FaGasPump className="text-2xl" />;
    if (type.includes('general') || type.includes('service')) return <FaTools className="text-2xl" />;
    return <FaCarSide className="text-2xl" />;
  };

  const handleBookNow = async (serviceId) => {
    if (!user) {
      toast.error('Please login to book services');
      return;
    }
    if (!selectedCar || !date) {
      toast.error('Please select car and date');
      return;
    }
    
    try {
      setIsBooking(true);
      setActiveService(serviceId);
      const service = services.find(s => s._id === serviceId);
      
      await bookingService.bookService({
        serviceType: serviceId,
        car: {
          model: user.cars.find(c => c._id === selectedCar).model,
          licensePlate: user.cars.find(c => c._id === selectedCar).licensePlate
        },
        scheduledDate: date
      });
      
      toast.success(`${service.name} booked successfully!`);
      setSelectedCar('');
      setDate('');
    } catch (err) {
      const errorMessage = err?.message || 'Failed to book service';
      toast.error(errorMessage);
      console.error('Booking error:', err);
    } finally {
      setIsBooking(false);
      setActiveService(null);
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4 min-h-screen flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-red-600 mb-4" />
          <p className="text-lg text-gray-600">Loading services...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Header Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 md:mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full text-white shadow-lg">
            <GiCarKey className="text-3xl" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Our <span className="text-red-600">Premium</span> Services
        </h1>
        <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Expert car care solutions with our signature red carpet service
        </p>
      </motion.div>

      {/* Booking Form */}
      {user && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 md:p-6 rounded-xl shadow-lg mb-8 md:mb-10 border border-gray-200"
        >
          <div className="flex items-center mb-5 md:mb-6">
            <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4 text-red-600">
              <FaCalendarAlt className="text-lg md:text-xl" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Schedule Your Service
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-gray-700 mb-2 md:mb-3 font-medium">
                <div className="flex items-center">
                  <div className="bg-red-100 p-1 md:p-2 rounded-full mr-2 md:mr-3 text-red-600">
                    <FaCarSide className="text-sm md:text-base" />
                  </div>
                  <span className="text-sm md:text-base">Select Your Vehicle</span>
                </div>
              </label>
              <select 
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                className="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                disabled={isBooking}
              >
                <option value="">Select Car</option>
                {user.cars?.map(car => (
                  <option key={car._id} value={car._id}>
                    {car.model} {car.licensePlate && `(${car.licensePlate})`}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 md:mb-3 font-medium">
                <div className="flex items-center">
                  <div className="bg-red-100 p-1 md:p-2 rounded-full mr-2 md:mr-3 text-red-600">
                    <FaCalendarAlt className="text-sm md:text-base" />
                  </div>
                  <span className="text-sm md:text-base">Preferred Date & Time</span>
                </div>
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                min={new Date().toISOString().slice(0, 16)}
                disabled={isBooking}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Services Grid */}
      {services.length === 0 ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 md:p-8 rounded-xl shadow-md text-center border border-gray-200"
        >
          <div className="bg-red-100 p-4 md:p-5 rounded-full inline-block mb-4 md:mb-6">
            <FaCarCrash className="text-3xl md:text-4xl text-red-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Our Services Are Coming Soon</h2>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">We're preparing something special for your vehicle</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 md:px-6 md:py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm md:text-base"
          >
            Refresh Page
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <ServiceCard
                service={service}
                selectedCar={selectedCar}
                date={date}
                onBookNow={handleBookNow}
                isBooking={isBooking && activeService === service._id}
                activeService={activeService}
                icon={getServiceIcon(service.category || service.name)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}