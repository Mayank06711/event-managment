import Booking from "../models/bookingModel.js";
import Service  from "../models/serviceModel.js";

const createBooking = async (req, res) => {
  const { serviceId, bookingDate, daysBooked } = req.body;

  const service = await Service.findById(serviceId);
  if (!service) return res.status(404).json({ message: "Service not found" });

  const totalPrice = daysBooked * service.pricePerDay;

  const booking = await Booking.create({
    user: req.user.id,
    service: serviceId,
    bookingDate,
    daysBooked,
    totalPrice,
  });

  res.status(201).json(booking);
};

const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate(
    "service"
  );
  res.status(200).json(bookings);
};

const getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate("user service");
  res.status(200).json(bookings);
};
export default {
  createBooking,
  getUserBookings,
  getAllBookings,
};
