const express = require("express");
const router = express.Router();
const passport = require("passport");
const recaptcha = require("../config/recaptcha");

const usersController = require("../controllers/users_controller.js");

// Display the Sign-up form
router.get("/sign-up", usersController.signUp);

// Logging in and creating session (stored in db)
router.post(
	"/create-session",
	recaptcha.verifyRecaptcha,
	passport.authenticate("local", { failureRedirect: "/", failureFlash: true }),
	usersController.createSession
);

// Creating a user-password for the first time in db
router.post(
	"/create-user",
	recaptcha.verifyRecaptcha,
	usersController.createUser
);

//Logging out the user for the current session
router.post("/sign-out", usersController.signOut);

//Access to profile page and menu options
router.get("/profile", passport.checkAuthentication, usersController.profile);

//Display the change password Page
router.get(
	"/change-password/:id",
	passport.checkAuthentication,
	usersController.changePassword
);

//Update the password in db
router.post(
	"/update-password/:id",
	passport.checkAuthentication,
	usersController.updatePassword
);

//Auth via google
router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

//Callback URL connecting to controller
router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	usersController.createSession
);

//renders the forgot password page
router.get("/forgot-password", usersController.forgotPassword);

//sends the reset password link to the user's email
router.post("/forgot-password", usersController.forgotPasswordEmail);

//renders the reset password page
router.get("/reset-password/:accessToken", usersController.resetPassword);

//Creates and Updates the new Password for the user
router.post("/create-password/:id", usersController.createPassword);

module.exports = router;
