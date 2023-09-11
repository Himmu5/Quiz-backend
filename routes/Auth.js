const express = require("express");
require("dotenv").config();
const router = express.Router();
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/User");

router.post("/Signup", async (req, res) => {
  // Extract user data from the request body
  const reqData = req.body;

  try {
    // Generate a salt and hash the user's password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(reqData.password, salt);

    // Create a JWT token based on the user's email and a secret key
    const token = jwt.sign({ email: reqData.email }, process.env.SECKET_KEY);

    // Create a new user document in the database
    const user = await UserModel.create({
      email: reqData.email,
      password: hashPassword,
    });

    console.log("User:", user);

    // Send a JSON response with the created user document
    res.json({
      data: { user, idToken: token },
      message: "User created successfully",
    });
  } catch (err) {
    // Handle errors, e.g., if the user couldn't be created
    console.error("Error creating user:", err);
    res
      .status(500)
      .json({ message: "Account could not be created", error: err });
  }
});

router.post("/Signin", async (req, res) => {
  // Extract user data from the request body
  const reqData = req.body;
  const token = jwt.sign(reqData.email, process.env.SECKET_KEY);
  if (token) {
    const user = await UserModel.findOne({ email: reqData.email });

    if (user) {
      if (bcrypt.compareSync(reqData.password, user.password)) {
        res.json({
          data: { user, idToken: token },
          message: "Signin successfully",
        });
      } else {
        res.status(400).json("Invalid Credientials");
      }
    } else {
      res.status(404).json("Data Not Found");
    }
  }
});
// Define a middleware function for JWT verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const newToken = token.split(" ")[1];
  jwt.verify(newToken, process.env.SECKET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid Token" });
    }
    req.user = decoded; // Attach user information to the request
    next(); // Continue to the next middleware or route handler
  });
};

// Use the middleware in your route
router.get("/me", verifyToken, async (req, res) => {
  // Now you can access req.user to get the user information
  
  console.log("me api", req.user.email);
  const user = await UserModel.findOne({ email: req.user.email });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: "User Not Found" });
  }
});

module.exports = { router };
