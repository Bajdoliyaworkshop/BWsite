import CarService from '../models/CarService.js';
import ServiceOffering from '../models/ServiceOffering.js';

export const bookService = async (req, res) => {
  try {
    const service = new CarService({
      ...req.body,
      user: req.user._id
    });
    await service.save();
    
    // Populate the serviceType before returning
    const populatedService = await CarService.findById(service._id)
      .populate('serviceType', 'name duration price')
      .lean();
    
    // req.io.emit('newBooking', populatedService);
    
    res.status(201).json({
      success: true,
      service: populatedService
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to create booking'
    });
  }
};

export const getAllServices = async (req, res) => {
  try {
    // console.log('Fetching services...');
    const services = await ServiceOffering.find({ isActive: true });
    // console.log('Services found:', services.length);
    res.send(services);
  } catch (err) {
    // console.error('Error fetching services:', err);
    res.status(500).send(err);
  }
};

export const cancelService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await CarService.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    if (service.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to cancel this service' });
    }
    
    await CarService.findByIdAndDelete(serviceId);
    
    // req.io.emit('serviceCancelled', serviceId);
    
    res.status(200).json({ success: true, message: 'Service cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Failed to cancel service' });
  }
}