const fpMailer = require("../mailers/forgotPassword");
const User = require("../models/User");
const Users = require("../models/User");
const Tokens = require("../models/UserToken");
const crypto = require("crypto");

//Renders the sign-up form
module.exports.signUp = function (req, res) {
	res.render("sign_up.ejs");
};

//This controller can only be reached after Auth - check associated route (Renders the profile page)
module.exports.createSession = function (req, res) {
	req.flash("message", `Welcome ${req.user.name}!!`);
	return res.redirect("/users/profile");
};

//Creates the user, duplicate email or empID not allowed
module.exports.createUser = async function (req, res) {
	if (req.body.password != req.body.cpassword) {
		req.flash(
			"message",
			`Password and Confirm password fields Do Not Match !!`
		);
		return res.redirect("back");
	}
	let userEmail = await Users.findOne({ email: req.body.email });

	if (userEmail) {
		req.flash("message", "User already exists");
		return res.redirect("/");
	}
	await Users.create({
		email: req.body.email,
		password: req.body.password,
		name: req.body.name,
	});
	req.flash("message", "Successfully registered, Please Sign In to continue");
	return res.redirect("/");
};

//Signs out the current logged in user
module.exports.signOut = function (req, res) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash("message", "Successfully Logged Out");
		return res.redirect("/");
	});
};

//Renders the profile page with the jobs coming in from API mentioned above
module.exports.profile = async function (req, res) {
	return res.render("profile.ejs");
};

//Renders the change password view
module.exports.changePassword = async function (req, res) {
	let user = await Users.findById(req.params.id);
	return res.render("changePass.ejs", {
		user,
	});
};

//Updates the password
module.exports.updatePassword = async function (req, res) {
	if (req.body.new != req.body.cnew) {
		req.flash(
			"message",
			`New password and Confirm password fields Do Not Match !!`
		);
		return res.redirect("back");
	}
	try {
		let user = await Users.findById(req.params.id);
		console.log(user);
		let pass = await user.comparePassword(req.body.old);
		if (!pass) {
			req.flash("message", `Old Password is incorrect`);
			return res.redirect("back");
		} else if (user && pass) {
			user.password = req.body.new;
			await user.save();
			req.flash("message", `Password Changed Successfully`);
			return res.redirect("/users/profile");
		} else {
			req.flash("message", `Error in changing the password`);
			return res.redirect("back");
		}
	} catch (error) {
		console.log(error);
		req.flash("message", `Error in changing the password`);
		res.redirect("back");
	}
};

//renders the forgot password page
module.exports.forgotPassword = function (req, res) {
	return res.render("forgotPass.ejs");
};

//sends the reset password link to the user's email
module.exports.forgotPasswordEmail = async function (req, res) {
	try {
		let user = await Users.findOne({ email: req.body.email });
		if (user) {
			let token = await Tokens.create({
				user: user.id,
				accessToken: crypto.randomBytes(20).toString("hex"),
			});
			fpMailer.forgotPassword({ user, token });
			req.flash("message", `Please check your inbox to reset password`);
			res.redirect("/");
		} else {
			req.flash("message", `User does not exist`);
			res.redirect("back");
		}
	} catch (error) {
		console.log("Error in reset password process", error);
		req.flash("message", `There was an error, Please Contact Support`);
		res.redirect("/");
	}
};

//renders the reset password page only if the token is valid
module.exports.resetPassword = async function (req, res) {
	let token = await Tokens.findOne({ accessToken: req.params.accessToken });

	if (token && token.isValid) {
		req.flash("message", `Kindly set a new password`);
		return res.render("resetPass.ejs", { token });
	}
	req.flash("message", `This URL is not valid anymore`);
	res.redirect("/");
};

//Creates the new password
module.exports.createPassword = async function (req, res) {
	let tokenID = req.query.t;
	if (req.body.password != req.body.cpassword) {
		req.flash("message", `Password fields do not match`);
		res.redirect("back");
	}
	try {
		let user = await User.findById(req.params.id);
		if (user) {
			user.password = req.body.password;
			await user.save();

			req.flash("message", `Password Created Successfully`);
			res.redirect("/");
			let accessToken = await Tokens.findByIdAndUpdate(tokenID, {
				isValid: false,
			});
			await accessToken.save();
			return;
		} else {
			req.flash("message", `Error in changing the password`);
			return res.redirect("/");
		}
	} catch (error) {
		console.error("Error:", error);
		req.flash(
			"message",
			`Error in creating the password, Please Contact Support`
		);
		res.redirect("/");
	}
};
