import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required"
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
      return res.json({
        message: "Authentication environment variables are missing"
      });
    }

    // Verify the ID token issued by Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
      return res.json({
        message: "Invalid Google account information"
      });
    }

    // Issue our application's own token
    const token = jwt.sign(
      {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || "",
        picture: payload.picture || ""
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    return res.status(200).json({
      message: "Google authentication successful",
      token,
      user: {
        id: payload.sub,
        name: payload.name || "",
        email: payload.email,
        picture: payload.picture || ""
      }
    });

  } catch (error) {
    console.error("Google authentication error:", error.message);

    return res.json({
      message: "Google authentication failed"
    });
  }
});

export default router;
