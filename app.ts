import { Request, Response } from "express";
import { CustomResponse } from "./types/common";

const express = require("express");
const boom = require("express-boom");
const app = express();
const serverStartDate = Date.now();
const PORT = 8000;
const connectDB = require("./db/conn");
const logger = require("./utils/logger");
const auth = require("./routes/auth");

connectDB();

app.use(boom());
app.use(express.json());

// Routes from feat/googleauth
app.get("/privacy", (req: Request, res: Response) => {
  return res.json({ message: "privacy page" });
});

app.get("/tos", (req: Request, res: Response) => {
  return res.json({ message: "tos page" });
});

// Routes from main
app.use("/events", require("./routes/events"));

// Health check route
app.get("/health", (req: Request, res: Response) => {
  const healthTimeInSeconds = (Date.now() - serverStartDate) / 1000;

  return res.json({
    message: "Server is up and working",
    data: {
      upTime: healthTimeInSeconds,
    },
  });
});

// Auth routes
app.use(auth);

// Handle 404 errors
app.use(function (req: Request, res: CustomResponse) {
  res.boom.notFound();
});

app.listen(PORT, (error: Error) => {
  if (error) console.error();
  logger.info(`Listening to the port ${PORT}`);
});
