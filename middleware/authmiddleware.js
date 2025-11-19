    // This function checks if a user is logged in
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        // If user exists in session, let them pass!
        return next();
    } else {
        // If not, kick them to the login page with a message
        return res.redirect('/login?error=Please login first to create a logo');
    }
};

module.exports = requireLogin;