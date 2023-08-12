const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Users = require("../models/User");

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passReqToCallback: true,
		},
		async function (req, username, password, done) {
			try {
				let user = await Users.findOne({ email: username });

				if (user) {
					let pass = await user.comparePassword(password);
					if (pass) {
						return done(null, user);
					}
				}
				req.flash("message", `Invalid Username/Password`);
				return done(null, false);
			} catch (error) {
				return done(error);
			}
		}
	)
);

//serailizing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
	let user;

	try {
		user = await Users.findById(id);

		if (user) {
			return done(null, user);
		}
	} catch (error) {
		console.log(error);
	}
});

//checking auth for the current user
passport.checkAuthentication = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.redirect("/");
};

//disabling sign in for user if already logged in
passport.disableSignIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect("/users/profile");
	}

	next();
};

//sets the current authenticated user to the locals
passport.setAuthenticatedUser = function (req, res, next) {
	if (req.isAuthenticated()) {
		res.locals.user = req.user;
	}
	next();
};

module.exports = passport;
