const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware'); 
const Logo = require('../models/logo');

// --- PUBLIC ROUTES ---
router.get('/', (req, res) => res.render('home', { user: req.session.user }));
router.get('/features', (req, res) => res.render('features', { user: req.session.user }));
router.get('/templates', (req, res) => res.render('templates', { user: req.session.user }));

router.get('/login', (req, res) => {
    if(req.session.user) return res.redirect('/');
    res.render('login', { user: null });
});

router.get('/register', (req, res) => {
    if(req.session.user) return res.redirect('/');
    res.render('register', { user: null });
});

// --- PROTECTED ROUTES ---

// 1. DASHBOARD (This was missing!)
router.get('/dashboard', requireAuth, async (req, res) => {
    try {
        // Find all logos belonging to the logged-in user
        const logos = await Logo.find({ user: req.session.user._id }).sort({ createdAt: -1 });
        
        res.render('dashboard', { 
            user: req.session.user, 
            logos: logos 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// 2. JOIN ROOM PAGE
router.get('/join-room', requireAuth, (req, res) => {
    res.render('joinRoom', { user: req.session.user });
});

// 3. EDITOR (Handles Database ID OR Live Room ID)
router.get('/editor', requireAuth, async (req, res) => {
    let logoToEdit = null;
    let roomId = null;

    // Case A: Editing a saved file
    if (req.query.id) {
        try {
            logoToEdit = await Logo.findById(req.query.id);
            if (logoToEdit) {
                roomId = logoToEdit._id.toString(); // Use DB ID as Room ID
            }
        } catch (err) { console.error("DB Error:", err); }
    } 
    // Case B: Joining a Live Room
    else if (req.query.room) {
        roomId = req.query.room;
    }

    res.render('editor', { 
        user: req.session.user,
        logoToEdit: logoToEdit, 
        roomId: roomId 
    });
});

module.exports = router;