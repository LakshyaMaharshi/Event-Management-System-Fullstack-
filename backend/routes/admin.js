const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { sendNotification, notificationTemplates } = require('../utils/notifications');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/pending-events', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const events = await Event.find({ status: 'pending' })
      .populate('submittedBy', 'name email phone organization')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments({ status: 'pending' });

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

router.get('/events', async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const events = await Event.find(query)
      .populate('submittedBy', 'name email phone organization')
      .populate('reviewedBy', 'name')
      .sort(sortOptions)
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

router.put('/events/:id/approve', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('submittedBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending events can be approved',
      });
    }

    event.status = 'approved';
    event.reviewedBy = req.user.id;
    event.reviewedAt = new Date();
    event.reviewNotes = req.body.notes || '';

    await event.save();

    const notificationTemplate = notificationTemplates.eventApproved(
      event.submittedBy.name,
      event.title,
      req.body.notes || ''
    );
    
    await sendNotification(event.submittedBy._id, notificationTemplate, event._id);

    res.status(200).json({
      success: true,
      message: 'Event approved successfully',
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

router.put('/events/:id/deny', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('submittedBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending events can be denied',
      });
    }

    event.status = 'denied';
    event.reviewedBy = req.user.id;
    event.reviewedAt = new Date();
    event.reviewNotes = req.body.reason || 'No reason provided';

    await event.save();

    const notificationTemplate = notificationTemplates.eventDenied(
      event.submittedBy.name,
      event.title,
      event.reviewNotes
    );
    
    await sendNotification(event.submittedBy._id, notificationTemplate, event._id);

    res.status(200).json({
      success: true,
      message: 'Event denied successfully',
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

router.put('/events/:id/complete', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('submittedBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved events can be marked as completed',
      });
    }

    event.status = 'completed';
    await event.save();

    const notificationTemplate = notificationTemplates.eventCompleted(
      event.submittedBy.name,
      event.title
    );
    
    await sendNotification(event.submittedBy._id, notificationTemplate, event._id);

    res.status(200).json({
      success: true,
      message: 'Event marked as completed',
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

router.get('/analytics', async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query;

    const startDate = month 
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    
    const endDate = month
      ? new Date(year, month, 0)
      : new Date(year, 11, 31);

    const totalEvents = await Event.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const eventsByStatus = await Event.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const eventsByCategory = await Event.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const avgRating = await Event.aggregate([
      {
        $match: {
          'feedback.0': { $exists: true },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $unwind: '$feedback'
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$feedback.rating' },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);

    const monthlyTrends = await Event.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const peakTimes = await Event.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$eventDate' },
            hour: { $substr: ['$eventTime', 0, 2] }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: month ? `${year}-${month}` : year.toString(),
        totalEvents,
        eventsByStatus,
        eventsByCategory,
        averageRating: avgRating[0]?.averageRating || 0,
        totalFeedback: avgRating[0]?.totalFeedback || 0,
        monthlyTrends,
        peakTimes,
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

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ role: 'user' });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users,
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
