# Email Configuration Guide

This application supports both simulated and real email notifications. By default, emails are simulated in development for easier testing.

## Email Simulation (Default)

In development mode, emails are logged to the console instead of being sent. This is useful for testing without setting up real email credentials.

## Enabling Real Emails

To enable real email sending, follow these steps:

### 1. Copy Environment File
```bash
cd backend
cp .env.example .env
```

### 2. Configure Email Settings

Edit the `.env` file and set the following variables:

```env
# Enable real emails
ENABLE_REAL_EMAILS=true

# Gmail Configuration (Recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Or use other email services:
# Outlook: smtp-mail.outlook.com:587
# Yahoo: smtp.mail.yahoo.com:587
# Custom SMTP: your-smtp-server.com:587

# Sender Information
FROM_NAME=Event Management System
FROM_EMAIL=noreply@yourcompany.com
```

### 3. Gmail Setup (Most Common)

If using Gmail:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

3. **Alternative**: Use OAuth2 (more secure but complex setup)

### 4. Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

#### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
```

#### Custom SMTP
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587  # or 465 for SSL
EMAIL_USER=your_username
EMAIL_PASS=your_password
```

### 5. Testing Email Configuration

1. Start the backend server:
```bash
npm run dev
```

2. Create a new event through the frontend
3. Check your email for the confirmation
4. Check the server console for email logs

## Email Templates

The application sends emails for:

- ✅ **Event Submission**: Confirmation when user submits an event
- 🎉 **Event Approval**: Notification when admin approves an event
- ❌ **Event Denial**: Notification when admin denies an event with reason
- ✅ **Event Completion**: Notification when event is marked as completed

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**:
   - Check username/password
   - For Gmail, ensure you're using an App Password, not your regular password
   - Verify 2FA is enabled

2. **Connection timeout**:
   - Check EMAIL_HOST and EMAIL_PORT
   - Verify firewall/network settings
   - Try different ports (587, 465, 25)

3. **Authentication failed**:
   - Double-check credentials
   - Some providers require "Less secure app access" to be enabled
   - Consider using OAuth2 for better security

### Testing in Development

To test emails without sending real ones:
```env
ENABLE_REAL_EMAILS=false
```

This will log emails to the console with full content for debugging.

### Security Notes

- Never commit real credentials to version control
- Use environment variables for all sensitive data
- Consider using OAuth2 for production applications
- Regularly rotate email passwords
- Use dedicated email accounts for applications

### Production Deployment

For production:
1. Use a dedicated email service (SendGrid, Mailgun, AWS SES)
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Monitor email delivery rates
4. Implement proper error handling and retry logic

## Support

If you encounter issues with email configuration:
1. Check the server console for detailed error messages
2. Verify your email provider's SMTP settings
3. Test with a simple email client first
4. Contact your email provider's support if needed
