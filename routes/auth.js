const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user");

// @route   GET /login
// @desc    Login page
// @access  Public
router.get("/login", authController.getLogin);

// @route   POST /login
// @desc    Authenticate a user
// @access  Public
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((val) => {
        return User.findOne({ email: val }).then((user) => {
          if (!user) {
            return Promise.reject("User does not exist");
          }
        });
      }),
    body("password").custom((val, { req }) => {
      return User.findOne({ email: req.body.email }).then((user) => {
        if (val !== user.password) {
          return Promise.reject("Wrong password. Please try again.");
        }
      });
    }),
  ],
  authController.postLogin
);

// @route   POST /logout
// @desc    Un-authenticate a user
// @access  Public
router.post("/logout", authController.postLogout);

// @route   GET /signup
// @desc    User registration
// @access  Public
router.get("/signup", authController.getSignup);

// @route   POST /signup
// @desc    User registration
// @access  Public
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid Email")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "Email already exists. Please enter a different one."
            );
          }
        });
      }),
    body("password").isLength({ min: 5 }).isAlphanumeric(),
    body("confirmPassword").custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ],
  authController.postSignup
);

module.exports = router;
