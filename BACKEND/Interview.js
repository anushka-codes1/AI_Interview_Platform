import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    experience: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      required: true,
      trim: true
    },

    interviewType: {
      type: String,
      required: true,
      trim: true
    },

    numberOfQuestions: {
      type: Number,
      required: true,
      min: 1
    },

    questions: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
