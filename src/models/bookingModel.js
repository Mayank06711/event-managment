import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookingDate: { type: Date, required: true },
    daysBooked: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"] },
  },
  { timestamps: true }
);

BookingSchema.index({ service: 1, type: mongoose.Schema.Types.ObjectId });
const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
