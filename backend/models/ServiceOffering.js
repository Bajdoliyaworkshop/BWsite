import mongoose from 'mongoose';

const ServiceOfferingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('ServiceOffering', ServiceOfferingSchema);