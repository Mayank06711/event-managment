import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description:{ type: String,},
    category: { type: String, enum: ['venue', 'hotel', 'caterer', 'dj', 'cameraman', ], required: true },
    pricePerDay: { type: Number, required: true },
    capacity:{type: Number},
    availability: [{ type: Date, required: true }],
    contactInfo: { type: String, required: true },
    ratings: { type: Number}
},{timestamps:true});

serviceSchema.index({ category: 1, availability: 1 });
serviceSchema.index({ title: 'text' });

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
