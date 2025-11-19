const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      // (Note: In a real app you might want to render a page with an error instead of just text)
      return res.send('<p>User already exists. <a href="/login">Login</a></p>');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    // --- 🚀 MICROSERVICE CALL ---
    // We use fetch to talk to Port 4000
    // We don't 'await' it because we don't want to make the user wait for the email
    fetch('http://localhost:4000/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
    }).catch(err => console.error("Microservice Error:", err));
    // ---------------------------

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Show Register Page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle Register Logic
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.send('User already exists. <a href="/login">Login</a>');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    user = new User({ email, password: hashedPassword });
    await user.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Handle Login Logic
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.send('Invalid Credentials. <a href="/login">Try again</a>');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('Invalid Credentials. <a href="/login">Try again</a>');
    }

    // Create Session
    req.session.user = user;
    
    // Save session and redirect
    req.session.save(() => {
      res.redirect('/');
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Handle Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

router.post('/generate-token', (req, res) => {
  // 1. Check if user is logged in via session
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2. Create the payload (what's inside the token)
  const payload = {
    user: {
      id: req.session.user._id,
      email: req.session.user.email
    }
  };

  // 3. Sign the token (Create the JWT)
  // In a real app, 'mySecretKey' should be in .env
  jwt.sign(
    payload,
    'mySecretKey', 
    { expiresIn: '365d' }, // Token valid for 1 year
    (err, token) => {
      if (err) throw err;
      res.json({ token }); // Send token back to frontend
    }
  );
});

module.exports = router;