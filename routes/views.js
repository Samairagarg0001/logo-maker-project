const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/authMiddleware');
const Logo = require('../models/logo');

// Home & Public Pages
router.get('/', (req, res) => res.render('home'));
router.get('/features', (req, res) => res.render('features'));
router.get('/templates', (req, res) => res.render('templates'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// --- PROTECTED ROUTES ---

// Dashboard: Show all User's Logos
router.get('/dashboard', requireLogin, async (req, res) => {
    try {
        // Find logos where 'user' matches the logged-in session ID
        const logos = await Logo.find({ user: req.session.user._id }).sort({ createdAt: -1 });
        res.render('dashboard', { logos: logos });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Editor: Handle New OR Edit
router.get('/editor', requireLogin, async (req, res) => {
    let logoToEdit = null;

    // If there is an ?id=... in the URL, fetch that logo
    if (req.query.id) {
        try {
            logoToEdit = await Logo.findById(req.query.id);
            // Security: Ensure this logo belongs to the logged-in user
            if (logoToEdit.user.toString() !== req.session.user._id.toString()) {
                return res.redirect('/dashboard');
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Render editor, passing the logo data (if it exists)
    res.render('editor', { logoToEdit: logoToEdit });
});

module.exports = router;