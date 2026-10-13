import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "./User.js";

const router = express.Router();

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.json({
        message: "Google credential is required"
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
      return res.json({
        message: "Authentication environment variables are missing"
      });
    }

    // 1. Verify the Google ID token
    const googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID
    );

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload?.email) {
      return res.json({
        message: "Invalid Google account information"
      });
    }

    const email = payload.email.toLowerCase();

    // 2. Find the existing user by Google ID or email
    let user = await User.findOne({
      $or: [
        { googleId: payload.sub },
        { email: email }
      ]
    });

    if (user) {
      // Update the user's Google profile details
      user.googleId = payload.sub;
      user.name = payload.name || user.name;
      user.picture = payload.picture || user.picture;

      await user.save();
    } else {
      // 3. Create a new user if one doesn't exist
      user = await User.create({
        googleId: payload.sub,
        name: payload.name || "User",
        email: email,
        picture: payload.picture || "",
        role: "user"
      });
    }

    // 4. Create the application's JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Send the saved user's details to the frontend
    return res.json({
      message: "Google authentication successful",
      token,
      user: {
        id: user._id.toString(),
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Google authentication error:", error);

    if (error.code === 11000) {
      return res.json({
        message: "A user with this email already exists."
      });
    }

    return res.json({
      message: "Google authentication failed"
    });
  }
});

export default router;
