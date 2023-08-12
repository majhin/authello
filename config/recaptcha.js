const axios = require("axios");

//verfies if recaptcha was completed by user
module.exports.verifyRecaptcha = async function (req, res, next) {
	const userResponse = req.body["g-recaptcha-response"];
	const secretKey = process.env.RECAPTCHA_SECRET_KEY;

	try {
		const response = await axios.post(
			"https://www.google.com/recaptcha/api/siteverify",
			null,
			{
				params: {
					secret: secretKey,
					response: userResponse,
				},
			}
		);

		const { success } = response.data;

		if (success) {
			//Allows the user to proceed
			next();
		} else {
			req.flash("message", `Captcha Verification failed`);
			return res.redirect("back");
		}
	} catch (error) {
		console.error("reCAPTCHA verification error:", error);
	}
};
