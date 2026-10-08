import express from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/db")
  .then(() => console.log("Database connected"));

// ======================================================
// START SERVER
// ======================================================

app.listen(3000, () => {
  console.log("Server running on port 3000");
});