const express = require('express');
const router = express.Router();

// Features data
const features = [
  { icon: 'palette', title: 'Easy Customization', desc: 'Edit text, colors, fonts, and icons with just a few clicks.' },
  { icon: 'bolt', title: 'Fast & Interactive', desc: 'Drag-and-drop editor with live preview for instant results.' },
  { icon: 'folder-open', title: 'Save & Export', desc: 'Download logos in PNG, JPG, or SVG and use them anywhere.' },
  { icon: 'fill-drip', title: 'Color Palettes', desc: 'Choose from a variety of professional color palettes.' },
  { icon: 'font', title: 'Font Selection', desc: 'Access dozens of fonts to match your logo style.' },
  { icon: 'search', title: 'Logo Preview', desc: 'Preview your logo in different sizes and backgrounds.' },
  { icon: 'icons', title: 'Icon Library', desc: 'Explore hundreds of icons to add the perfect touch.' },
  { icon: 'cloud', title: 'Cloud Save', desc: 'Save your logos safely online and access them anytime.' },
  { icon: 'tools', title: 'Advanced Tools', desc: 'Use vector shapes and layers for professional design.' },
  { icon: 'mobile-alt', title: 'Mobile Friendly', desc: 'Create and edit logos on any device.' },
];

// Route to get all features
router.get('/', (req, res) => {
  res.json(features);
});

module.exports = router;