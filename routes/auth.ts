import { Request, Response } from "express";

const express = require("express");
const axios = require("axios");
const router = express.Router();
const logger = require("../utils/logger");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:8000/auth/google/callback";
const authMiddleware = require("../middlewares/auth");
// Initiates the Google Login flow
router.get("/auth/google", (req: Request, res: Response) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

// Initiates the Google Login flow
router.get("/auth/google", (req: Request, res: Response) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

// Callback URL for handling the Google Login response
router.get("/auth/google/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = data;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    // Code to handle user authentication and retrieval using the profile data
    console.log({ data, profile });
    res.redirect("/");
  } catch (error: any) {
    console.error("Error:", error);
    res.redirect("/login");
  }
});

router.get(
  "/authenticated",
  authMiddleware.verifyToken,
  (req: Request, res: Response) => {
    res.json({
      message: "You're authenticated",
    });
  }
);

module.exports = router;
