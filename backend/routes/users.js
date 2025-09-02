const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
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

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get event counts by status
    const totalEvents = await Event.countDocuments({ submittedBy: userId });
    const pendingEvents = await Event.countDocuments({ submittedBy: userId, status: 'pending' });
    const approvedEvents = await Event.countDocuments({ submittedBy: userId, status: 'approved' });
    const completedEvents = await Event.countDocuments({ submittedBy: userId, status: 'completed' });
    const deniedEvents = await Event.countDocuments({ submittedBy: userId, status: 'denied' });
    
    // Get user join date
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

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
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
