
import express from "express";
import mongoose from "mongoose";
import Interview from "./Interview.js";
import User from "./User.js";

const router = express.Router();

router.post("/interview", async (req, res) => {
  const {
    userId,
    experience,
    role,
    interviewType,
    numberOfQuestions,
    questions
  } = req.body;

  try {
    // Validate required fields
    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !experience ||
      !role ||
      !interviewType ||
      !numberOfQuestions ||
      !Array.isArray(questions)
    ) {
      return res.json({
        message: "Please provide userId and all required interview fields."
      });
    }

    // Confirm that this user exists
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.json({
        message: "User not found. Check the MongoDB user ID."
      });
    }

    // Map userId from the request to the schema's user field
    const interview = await Interview.create({
      user: existingUser._id,
      experience,
      role,
      interviewType,
      numberOfQuestions,
      questions
    });

    return res.json({
      message: "Interview created successfully",
      interview
    });
  } catch (error) {
    console.error("Interview creation error:", error);

    return res.json({
      message: "Failed to create interview",
      error: error.message
    });
  }
});

export default router;
