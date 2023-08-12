const nodeMailer = require("../config/nodemailer");

exports.forgotPassword = (data) => {
	let url = process.env.RESET_URL;
	let { user, token } = data;
	let htmlString = nodeMailer.renderTemplate(
		{ user, token, url },
		"/fpTemplate.ejs"
	);

	nodeMailer.transporter.sendMail(
		{
			from: "authello007@gmail.com",
			to: user.email,
			subject: "Password Reset Authello",
			html: htmlString,
		},
		(error, info) => {
			if (error) {
				console.log("Error in sending email", error);
				return;
			}
			console.log("Mail Delivered");
			return;
		}
	);
};
