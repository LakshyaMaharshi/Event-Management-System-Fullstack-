const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_REAL_EMAILS) {
    // For development without real emails, return a test transporter
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    // For development without real email setup, just log to console
    if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_REAL_EMAILS) {
      console.log('\n📧 ================================');
      console.log('📧 EMAIL NOTIFICATION SIMULATION');
      console.log('📧 ================================');
      console.log('📧 To:', options.email);
      console.log('📧 Subject:', options.subject);
      console.log('📧 Message:');
      console.log('📧 --------------------------------');
      console.log(options.message);
      console.log('📧 ================================\n');
      return { success: true, message: 'Email simulated successfully' };
    }

    const transporter = createTransporter();
    
    if (!transporter) {
      throw new Error('Email transporter not configured');
    }

    const message = {
      from: `${process.env.FROM_NAME || 'Event Management System'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message.replace(/\n/g, '<br>'),
    };

    const info = await transporter.sendMail(message);
    
    console.log('✅ Email sent successfully: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};

// Enhanced email templates with better formatting and contact details
const emailTemplates = {
  eventSubmitted: (userName, eventTitle, eventDetails) => ({
    subject: '✅ Event Request Submitted Successfully - Event Management System',
    message: `Hello ${userName},

Thank you for submitting your event request!

📋 EVENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Event Title: ${eventTitle}
📅 Date: ${eventDetails?.eventDate ? new Date(eventDetails.eventDate).toLocaleDateString() : 'TBD'}
⏰ Time: ${eventDetails?.eventTime || 'TBD'}
📍 Venue: ${eventDetails?.venue || 'TBD'}
👥 Capacity: ${eventDetails?.capacity || 'TBD'} attendees
🏷️ Category: ${eventDetails?.category ? eventDetails.category.charAt(0).toUpperCase() + eventDetails.category.slice(1) : 'TBD'}
${eventDetails?.priority ? `⚡ Priority: ${eventDetails.priority.charAt(0).toUpperCase() + eventDetails.priority.slice(1)}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 WHAT HAPPENS NEXT:
• Our admin team will review your request within 24-48 hours
• You'll receive an email notification once the review is complete
• You can track your event status in your dashboard anytime

🔗 QUICK ACTIONS:
• View your event: Log into your dashboard
• Contact support: Reply to this email or call us

📞 NEED HELP?
If you have any questions or need to make changes to your request, please contact our support team:

📧 Email: support@eventmanagement.com
📞 Phone: +1 (555) 123-4567
⏰ Hours: Monday-Friday, 9 AM - 6 PM EST

Thank you for choosing our Event Management System!

Best regards,
Event Management Team
Event Management System

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message. Please do not reply directly to this email.
For support, contact us at support@eventmanagement.com`,
  }),

  eventApproved: (userName, eventTitle, eventDetails) => ({
    subject: '🎉 Event Request APPROVED! - Your Event is Confirmed',
    message: `Hello ${userName},

🎉 GREAT NEWS! Your event request has been APPROVED! 🎉

📋 APPROVED EVENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Event Title: ${eventTitle}
📅 Date: ${eventDetails?.eventDate ? new Date(eventDetails.eventDate).toLocaleDateString() : 'TBD'}
⏰ Time: ${eventDetails?.eventTime || 'TBD'}
📍 Venue: ${eventDetails?.venue || 'TBD'}
👥 Capacity: ${eventDetails?.capacity || 'TBD'} attendees
🏷️ Category: ${eventDetails?.category ? eventDetails.category.charAt(0).toUpperCase() + eventDetails.category.slice(1) : 'TBD'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 NEXT STEPS:
1. You will receive detailed event coordination information within 24 hours
2. Our event coordination team will contact you to finalize arrangements
3. Any special requirements will be addressed during coordination

🔗 IMPORTANT LINKS:
• View full event details: Log into your dashboard
• Download event confirmation: Available in your dashboard
• Request changes: Contact us immediately if needed

⚠️ IMPORTANT REMINDERS:
• Please save this confirmation email for your records
• Contact us immediately if any details need to be changed
• Event setup will begin 2 hours before your scheduled time

📞 EVENT COORDINATION CONTACT:
Our event coordination team will reach out to you shortly. If you need immediate assistance:

📧 Email: events@eventmanagement.com
📞 Phone: +1 (555) 123-4567
⏰ Hours: Monday-Friday, 9 AM - 6 PM EST

Congratulations on your approved event! We're excited to help make it a success.

Best regards,
Event Management Team
Event Management System

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message. Please do not reply directly to this email.
For event coordination, contact us at events@eventmanagement.com`,
  }),

  eventDenied: (userName, eventTitle, reason, eventDetails) => ({
    subject: '❌ Event Request Update - Action Required',
    message: `Hello ${userName},

We regret to inform you that your event request requires attention before approval.

📋 EVENT REQUEST DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Event Title: ${eventTitle}
📅 Requested Date: ${eventDetails?.eventDate ? new Date(eventDetails.eventDate).toLocaleDateString() : 'TBD'}
⏰ Requested Time: ${eventDetails?.eventTime || 'TBD'}
📍 Requested Venue: ${eventDetails?.venue || 'TBD'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ REASON FOR REVIEW:
${reason || 'Please contact our support team for specific details about the required changes.'}

🔄 WHAT YOU CAN DO:
1. Review the feedback provided above
2. Make necessary adjustments to your event request
3. Submit a new request with the recommended changes
4. Contact our support team for clarification if needed

📞 NEED ASSISTANCE?
Our team is here to help you get your event approved:

📧 Email: support@eventmanagement.com
📞 Phone: +1 (555) 123-4567
⏰ Hours: Monday-Friday, 9 AM - 6 PM EST

🔗 SUBMIT NEW REQUEST:
• Log into your dashboard to create a new event request
• Reference this original request when contacting support
• Our team can help you address any concerns

We appreciate your interest in using our Event Management System and look forward to helping you plan a successful event.

Best regards,
Event Management Team
Event Management System

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message. Please do not reply directly to this email.
For support, contact us at support@eventmanagement.com`,
  }),

  eventCompleted: (userName, eventTitle) => ({
    subject: '✅ Event Completed - We\'d Love Your Feedback!',
    message: `Hello ${userName},

Your event "${eventTitle}" has been successfully completed! 🎉

We hope everything went smoothly and that your event was a great success.

📋 POST-EVENT ACTIONS:
• Rate your experience in your dashboard
• Provide feedback to help us improve our services
• Download event completion certificate (if applicable)

📞 QUESTIONS OR ISSUES?
If you experienced any issues or have questions about your completed event:

📧 Email: support@eventmanagement.com
📞 Phone: +1 (555) 123-4567

Thank you for choosing our Event Management System!

Best regards,
Event Management Team`,
  }),
};

module.exports = {
  sendEmail,
  emailTemplates,
};
