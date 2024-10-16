import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  eventType: { type: String, enum: ["wedding", "corporate", "birthday"] },
  date: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"] },
});

eventSchema.index({ date: 1, eventType: 1 });
eventSchema.index({ location: "text" });

const Event = mongoose.model("Event", eventSchema);

export default Event;
