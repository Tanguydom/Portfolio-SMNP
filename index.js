// Import dependencies
const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json()); // Parse JSON requests

// CORS configuration to allow only localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Nodemailer SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // false for 587, true for 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Test SMTP connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to SMTP server:', error);
    } else {
        console.log('SMTP server is ready to take messages');
    }
});

// Email sending route
app.post('/sendEmail', async (req, res) => {
    const { name, email, message } = req.body;
    const myEmail = 'tanguy.professionnel@outlook.fr';

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message' });
    }

    try {
        const mailOptions = {
            from: `"${name}" <${myEmail}>`, // Sender info
            to: 'tanguy.professionnel@outlook.fr', // Change to your desired recipient
            subject: `New message from ${name}`,
            text: email + '\n\n' + message
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
