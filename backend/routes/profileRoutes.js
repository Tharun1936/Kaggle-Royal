import { Router } from 'express';
import Profile from '../models/Profile.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const existing = await Profile.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A profile with this email already exists',
        profile: existing,
      });
    }

    const profile = await Profile.create(req.body);
    res.status(201).json({ success: true, profile });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/email/:email', async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.email });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
