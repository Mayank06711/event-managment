import Service from "../models/serviceModel.js";

const createService = async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
};

const getAllServices = async (req, res) => {
  const services = await Service.find(req.query).sort("pricePerDay");
  res.status(200).json(services);
};

const getService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.status(200).json(service);
};

const updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.status(200).json(service);
};

const deleteService = async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.status(204).json(null);
};

export default {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
};
