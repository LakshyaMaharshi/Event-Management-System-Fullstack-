const Notification = require('../models/Notification');

const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const notificationTemplates = {
  eventSubmitted: (userName, eventTitle) => ({
    type: 'event_submitted',
    title: 'Event Request Submitted',
    message: `Your event "${eventTitle}" has been submitted successfully and is pending admin review.`,
    priority: 'medium'
  }),

  eventApproved: (userName, eventTitle, adminNote = '') => ({
    type: 'event_approved',
    title: 'Event Approved! 🎉',
    message: `Great news! Your event "${eventTitle}" has been approved by the admin.${adminNote ? ` Note: ${adminNote}` : ''}`,
    priority: 'high'
  }),

  eventDenied: (userName, eventTitle, adminNote) => ({
    type: 'event_denied',
    title: 'Event Request Denied',
    message: `Unfortunately, your event "${eventTitle}" has been denied.`,
    adminNote: adminNote,
    priority: 'high'
  }),

  eventCompleted: (userName, eventTitle) => ({
    type: 'event_completed',
    title: 'Event Completed',
    message: `Your event "${eventTitle}" has been marked as completed. Thank you for using our platform!`,
    priority: 'medium'
  }),

  eventReminder: (userName, eventTitle, daysUntil) => ({
    type: 'event_reminder',
    title: 'Event Reminder',
    message: `Reminder: Your event "${eventTitle}" is ${daysUntil === 0 ? 'today' : daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`}.`,
    priority: daysUntil <= 1 ? 'urgent' : 'medium'
  })
};

const sendNotification = async (recipientId, template, eventId = null) => {
  try {
    const notificationData = {
      recipient: recipientId,
      eventId: eventId,
      ...template
    };
    
    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

const sendBulkNotifications = async (recipientIds, template, eventId = null) => {
  try {
    const notifications = recipientIds.map(recipientId => ({
      recipient: recipientId,
      eventId: eventId,
      ...template
    }));
    
    return await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  sendNotification,
  sendBulkNotifications,
  notificationTemplates
};
