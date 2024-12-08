import { Request, Response } from "express";
import { CustomResponse } from "../types/common";
import { Mongoose } from "mongoose";
const logger = require("../utils/logger");
const Event = require("../db/models/events");

const createEvent = async (req: Request, res: CustomResponse) => {
  const { name, startedDateTime, endDateTime, venueId, hostId } = req.body;

  try {
    const event = new Event({
      name,
      startedDateTime,
      endDateTime,
      venueId,
      hostId,
    });

    await event.save();

    return res.json({
      message: "Events created successfully",
      data: event,
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      message: "Couldn't create event. Please try again later",
      error: error.message,
    });
  }
};

const getEvents = async (req: Request, res: CustomResponse) => {
  try {
    const events = await Event.find({});

    return res.json({
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      message: "Couldn't get events. Please try again later",
      error: error.message,
    });
  }
};

const updateEventById = async (req: Request, res: CustomResponse) => {
  try {
    const eventUpdatePayload: Record<string, any> = {
      eventId: req.params?.eventId,
    };

    if (req.body?.name) {
      eventUpdatePayload.name = req.body.name;
    }

    if (req.body?.venueId) {
      eventUpdatePayload.venueId = req.body.venueId;
    }

    if (req.body?.endDateTime) {
      eventUpdatePayload.endDateTime = req.body.endDateTime;
    }

    if (req.body?.startedDateTime) {
      eventUpdatePayload.startedDateTime = req.body.startedDateTime;
    }

    await Event.findOneAndUpdate(
      {
        _id: req.params.eventId,
      },
      eventUpdatePayload
    );
    const updatedEvent = await Event.findById(req.params.eventId);

    return res.json({
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      message: "Couldn't update event. Please try again later",
      error: error.message,
    });
  }
};

const deleteEventById = async (req: Request, res: CustomResponse) => {
  try {
    await Event.findOneAndDelete({ _id: req.params.eventId });

    return res.json({
      message: "Event deleted successfully",
      data: null,
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      message: "Couldn't delete event. Please try again later",
      error: error.message,
    });
  }
};
module.exports = { createEvent, getEvents, updateEventById, deleteEventById };
