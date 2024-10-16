import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDate: { type: Date, required: true },
    daysBooked: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
},{timestamps:true});

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
