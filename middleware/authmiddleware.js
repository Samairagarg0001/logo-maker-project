// middleware/authMiddleware.js

const requireAuth = (req, res, next) => {
    // Check if user session exists
    if (req.session && req.session.user) {
        return next(); // User is logged in, proceed
    } else {
        return res.redirect('/login?error=Please login first'); // User not logged in
    }
};

// IMPORTANT: We export it as an object { requireAuth }
module.exports = { requireAuth };