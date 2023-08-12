# AuthHello - Local Setup Guide

AuthHello is a comprehensive authentication system that can be used as a starter code for creating new applications. This guide provides step-by-step instructions for setting up the project on your local system.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed on your system:

- Node.js: Download and install Node.js from [nodejs.org](https://nodejs.org/).
- Git: Download and install Git from [git-scm.com](https://git-scm.com/).

## Clone the Repository

Open a terminal window and run the following command to clone the repository:
git clone https://github.com/majhin/authello.git

## Install Dependencies

Navigate to the project directory using the terminal:
cd AuthHello

Install project dependencies using npm:
npm install

## Set Environment Variables

The project requires several environment variables to be set for proper configuration. Create a .env file in the root directory of the project and add the following variables with their corresponding values:

MONGO_URL=<your_mongo_db_url>
PORT=<desired_port_number>
SECRET=<your_secret_key>
EMAIL_AUTH_SECRET=<your_email_auth_secret>
PASSWORD_AUTH_SECRET=<your_password_auth_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=<your_google_callback_url>
RESET_URL=<your_reset_url>
RECAPTCHA_SITE_KEY=<your_recaptcha_site_key>
RECAPTCHA_SECRET_KEY=<your_recaptcha_secret_key>

Replace placeholders with your actual values.

## Start the Application

Start the application using npm:
npm start

This will start the server using Nodemon, which helps automatically restart the server when code changes are detected.

## Usage

The AuthHello authentication system is now running on your local system. Access it by navigating to http://localhost:<PORT> in your web browser.

## About the Project

AuthHello is a complete authentication system that provides features such as local authentication, Google OAuth, email verification, password reset, and reCAPTCHA integration. This project can serve as a foundation for applications with user authentication functionality.

For more information and documentation, Feel free to ping me

## Note: This project is meant for educational and demonstration purposes. Follow best practices for security before deploying it to a production environment.

## Happy coding!!
