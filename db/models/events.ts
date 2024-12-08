import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startedDateTime: {
    type: String,
    required: true,
  },
  endDateTime: {
    type: String,
    required: true,
  },
  venueId: {
    type: String,
    required: true,
  },
});

const eventModel = mongoose.model("event", eventSchema);

module.exports = eventModel;
