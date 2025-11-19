require('dotenv').config(); // Load .env variables
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 4000; // 👈 Running on a separate port

app.use(bodyParser.json());

// --- GMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // We will put these in .env
    pass: process.env.GMAIL_PASS
  }
});

// @route   POST /send-welcome
app.post('/send-welcome', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'No email provided' });
    }

    const mailOptions = {
        from: `"Logo Maker Team" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Logo Maker! 🎨',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4e54c8;">Welcome to the Family!</h2>
                <p>Hi there,</p>
                <p>Thank you for creating an account with <strong>Logo Maker</strong>.</p>
                <p>We are excited to see the amazing designs you will create.</p>
                <br>
                <a href="https://localhost:3000/dashboard" style="background: #4e54c8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
                <br><br>
                <p style="color: #888; font-size: 0.9rem;">Happy Designing,<br>The Team</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send' });
        }
        console.log(`✅ Email sent to: ${email}`);
        res.json({ message: 'Email sent successfully' });
    });
});

app.listen(port, () => {
    console.log(`📧 Email Microservice running on Port ${port}`);
});