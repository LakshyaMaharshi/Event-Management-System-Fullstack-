const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendNotification, notificationTemplates } = require('../utils/notifications');

const router = express.Router();

// @desc    Submit new event request
// @route   POST /api/events
// @access  Private
router.post('/', protect, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('eventDate').isISO8601().withMessage('Please provide a valid date'),
  body('eventTime').notEmpty().withMessage('Please provide event time'),
  body('duration').notEmpty().withMessage('Please provide event duration'),
  body('venue').trim().isLength({ min: 3 }).withMessage('Venue must be at least 3 characters'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  body('category').isIn(['conference', 'workshop', 'seminar', 'meeting', 'celebration', 'training', 'networking', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('estimatedCost').optional().isFloat({ min: 0 }).withMessage('Estimated cost must be a positive number'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const eventData = {
      ...req.body,
      submittedBy: req.user.id,
    };

    const event = await Event.create(eventData);

    // Send notification instead of email
    const notificationTemplate = notificationTemplates.eventSubmitted(req.user.name, event.title);
    await sendNotification(req.user.id, notificationTemplate, event._id);

    res.status(201).json({
      success: true,
      message: 'Event request submitted successfully',
      data: event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get user's events
// @route   GET /api/events/my-events
// @access  Private
router.get('/my-events', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { submittedBy: req.user.id };
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('submittedBy', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('submittedBy', 'name email phone organization')
      .populate('reviewedBy', 'name')
      .populate('feedback.user', 'name');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user owns the event or is admin
    if (event.submittedBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this event',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Update event (only if pending)
// @route   PUT /api/events/:id
// @access  Private
router.put('/:id', protect, [
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user owns the event
    if (event.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Only allow updates if event is pending
    if (event.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only update pending events',
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('submittedBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Submit feedback for an event
// @route   POST /api/events/:id/feedback
// @access  Private
router.post('/:id/feedback', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must not exceed 500 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is completed
    if (event.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only provide feedback for completed events',
      });
    }

    // Check if user already provided feedback
    const existingFeedback = event.feedback.find(
      feedback => feedback.user.toString() === req.user.id
    );

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'You have already provided feedback for this event',
      });
    }

    // Add feedback
    event.feedback.push({
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user owns the event or is admin
    if (event.submittedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    // Only allow deletion of pending or denied events
    if (event.status === 'approved' || event.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete approved or completed events',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
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
