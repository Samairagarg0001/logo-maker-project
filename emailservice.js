const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 4000; // Running on a different port

app.use(bodyParser.json());

// Create a "Fake" SMTP account automatically
let transporter;

nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create test account. ' + err.message);
        return process.exit(1);
    }

    console.log('📧 Email Microservice Ready on Port 4000');
    
    // Create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
});

// @route   POST /send-welcome
// @desc    Send a welcome email (Called by Main App)
app.post('/send-welcome', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'No email provided' });
    }

    const mailOptions = {
        from: '"Logo Maker Team" <support@logomaker.com>',
        to: email,
        subject: 'Welcome to Logo Maker! 🎨',
        text: 'Thank you for registering with Logo Maker. Start creating amazing designs today!',
        html: '<b>Thank you for registering with Logo Maker.</b><br>Start creating amazing designs today!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        
        console.log('📨 Email sent to: %s', email);
        // This URL allows you to view the email in your browser
        console.log('🔗 Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.json({ message: 'Email sent successfully', preview: nodemailer.getTestMessageUrl(info) });
    });
});

app.listen(port, () => {
    console.log(`🚀 Email Service running at http://localhost:${port}`);
});