import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['venue', 'hotel', 'caterer', 'dj', 'cameraman'], required: true },
    pricePerDay: { type: Number, required: true },
    description: { type: String, required: true },
    availability: [{ type: Date, required: true }],
    contactInfo: { type: String, required: true }
},{timestamps:true});

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
