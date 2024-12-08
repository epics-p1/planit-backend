import { NextFunction, Request, Response } from "express";
import { CustomResponse } from "../types/common";

const { OAuth2Client } = require("google-auth-library");

const verifyToken = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction
) => {
  const client = new OAuth2Client();
  const { token } = req.query;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    console.log({ ticket });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    console.log({ ticket, payload });

    if (!userid) return res.boom.unauthorized("You're unauthorized");
    next();
    // If the request specified a Google Workspace domain:
    // const domain = payload['hd'];
  } catch (error: any) {
    return res.boom.unauthorized("You're unauthorized");
  }
};

module.exports = { verifyToken };
