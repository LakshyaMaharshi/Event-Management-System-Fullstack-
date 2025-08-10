const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
  },
  eventDate: {
    type: Date,
    required: [true, 'Please provide an event date'],
  },
  eventTime: {
    type: String,
    required: [true, 'Please provide an event time'],
  },
  duration: {
    type: String,
    required: [true, 'Please provide event duration'],
  },
  venue: {
    type: String,
    required: [true, 'Please provide a venue'],
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide event capacity'],
  },
  category: {
    type: String,
    required: [true, 'Please provide event category'],
    enum: ['conference', 'workshop', 'seminar', 'meeting', 'celebration', 'training', 'networking', 'other'],
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  tags: [String],
  estimatedCost: {
    type: Number,
    min: 0,
  },
  requirements: {
    type: String,
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String,
  },
  isTemplate: {
    type: Boolean,
    default: false,
  },
  templateName: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'completed'],
    default: 'pending',
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
  reviewNotes: {
    type: String,
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Index for better performance
eventSchema.index({ submittedBy: 1, status: 1 });
eventSchema.index({ eventDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
