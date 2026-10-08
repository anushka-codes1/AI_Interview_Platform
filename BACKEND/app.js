import express from "express";
import cors from "cors";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.send("AI Interview Platform Backend is running");
});


// ======================================================
// SIGNUP
// ======================================================

app.post("/signUp", async (req, res) => {

  const { name, email, password, role } = req.body;

  try {

    // For now, we are NOT saving anything to MongoDB.
    // This is only to test the frontend-backend connection.

    console.log("Signup request received:");
    console.log({
      name,
      email,
      role
    });

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    console.log("Password hashed successfully");

    res.send({
      message: "Signup successful",
      user: {
        name,
        email,
        role: role || "user"
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).send({
      message: "Error occurred while signing up"
    });

  }
});


// ======================================================
// LOGIN
// ======================================================

app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    // For now, there is no database.
    // So we are only testing whether the request reaches
    // the backend correctly.

    console.log("Login request received:");
    console.log({
      email
    });

    // Temporary password hashing test
    const hashedPassword = await bcryptjs.hash(password, 10);

    console.log("Password processed successfully");

    // Temporary JWT
    const token = jwt.sign(
      {
        email: email
      },

      // TEMPORARY SECRET
      "temporary-secret",

      {
        expiresIn: "1h"
      }
    );

    res.send({
      message: "Login successful",
      token
    });

  } catch (err) {

    console.error(err);

    res.status(500).send({
      message: "Error occurred while logging in"
    });

  }
});


// ======================================================
// START SERVER
// ======================================================

app.listen(3000, () => {
  console.log("Server running on port 3000");
});