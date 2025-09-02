const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalEvents = await Event.countDocuments({ submittedBy: userId });
    const pendingEvents = await Event.countDocuments({ submittedBy: userId, status: 'pending' });
    const approvedEvents = await Event.countDocuments({ submittedBy: userId, status: 'approved' });
    const completedEvents = await Event.countDocuments({ submittedBy: userId, status: 'completed' });
    const deniedEvents = await Event.countDocuments({ submittedBy: userId, status: 'denied' });
    
    const user = await User.findById(userId).select('createdAt');
    
    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        pendingEvents,
        approvedEvents,
        completedEvents,
        deniedEvents,
        memberSince: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.put('/preferences', async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
