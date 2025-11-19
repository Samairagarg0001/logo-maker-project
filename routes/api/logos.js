const express = require('express');
const router = express.Router();
const Logo = require('../../models/logo');
const requireToken = require('../../middleware/jwtmiddleware');

// Save a Logo
router.post('/', async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, logoData } = req.body;

    const newLogo = new Logo({
      user: req.session.user._id, // Attach the logged-in user's ID
      name: name,
      logoData: logoData,
    });

    await newLogo.save();

    res.status(201).json({ message: 'Logo saved successfully!', logo: newLogo });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while saving logo' });
  }
});

router.get('/export', requireToken, async (req, res) => {
  try {
    // Fetch logos using the ID inside the JWT
    const logos = await Logo.find({ user: req.user.id });
    res.json(logos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const logo = await Logo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    // Security Check: Ensure the logged-in user owns this logo
    if (logo.user.toString() !== req.session.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Logo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Logo removed' });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
module.exports = router;