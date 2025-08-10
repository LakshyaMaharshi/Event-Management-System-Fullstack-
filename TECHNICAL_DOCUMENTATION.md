# Event Management System - Technical Documentation

## Overview
The Event Management System is a full-stack web application built with modern JavaScript technologies. It provides a comprehensive platform for users to submit event requests and administrators to manage approvals with real-time updates and analytics.

## Technology Stack

### Backend Technologies
- **Node.js**: JavaScript runtime environment for server-side development
- **Express.js**: Fast and minimalist web framework for Node.js, handling API routes and middleware
- **MongoDB**: NoSQL document database for storing user and event data
- **Mongoose**: MongoDB Object Document Mapper (ODM) for Node.js, providing schema validation and query building
- **JWT (JSON Web Tokens)**: Stateless authentication mechanism for secure user sessions
- **bcryptjs**: Password hashing library for secure password storage
- **express-validator**: Middleware for input validation and sanitization
- **cors**: Cross-Origin Resource Sharing middleware for frontend-backend communication
- **nodemailer**: Email sending library (currently simulated for development)
- **dotenv**: Environment variable management for configuration
- **nodemon**: Development tool for automatic server restart on file changes

### Frontend Technologies
- **React**: Component-based JavaScript library for building user interfaces
- **React Router DOM**: Declarative routing library for single-page application navigation
- **Axios**: Promise-based HTTP client for API communication
- **React Context API**: Built-in state management solution for global application state
- **CSS3**: Modern styling with Flexbox and Grid layouts for responsive design
- **HTML5**: Semantic markup for accessibility and SEO

### Development Tools
- **VS Code**: Integrated development environment with custom tasks and configurations
- **npm**: Package manager for JavaScript dependencies
- **Git**: Version control system for source code management

## Project Architecture

### Backend Structure
```
backend/
├── models/          # Database schemas and models
│   ├── User.js      # User model with authentication fields
│   └── Event.js     # Event model with status tracking
├── routes/          # API endpoint definitions
│   ├── auth.js      # Authentication routes (login, register, profile)
│   ├── events.js    # Event CRUD operations
│   ├── admin.js     # Admin-specific operations
│   └── users.js     # User profile management
├── middleware/      # Custom middleware functions
│   └── auth.js      # JWT verification and role-based access
├── utils/           # Helper functions
│   ├── sendEmail.js # Email notification system
│   └── sendTokenResponse.js # JWT token generation
├── server.js        # Main application entry point
├── seedAdmin.js     # Database seeding script
└── .env            # Environment variables
```

### Frontend Structure
```
frontend/frontend/src/
├── components/      # Reusable UI components
│   └── layout/      # Layout components
│       ├── Header.js   # Navigation header with authentication state
│       └── Layout.js   # Main layout wrapper
├── pages/           # Main application pages
│   ├── LandingPage.js    # Public homepage
│   ├── LoginPage.js      # User authentication
│   ├── RegisterPage.js   # User registration
│   ├── UserDashboard.js  # User event management
│   └── AdminDashboard.js # Admin control panel
├── context/         # State management
│   └── AuthContext.js    # Authentication state and methods
├── services/        # API communication
│   └── api.js       # Axios configuration and API calls
└── App.js          # Main application component with routing
```

## Database Schema

### User Model
- **Fields**: name, email, password (hashed), role (user/admin), phone, organization, preferences
- **Authentication**: bcrypt password hashing, JWT token-based sessions
- **Validation**: Email uniqueness, password strength requirements

### Event Model
- **Fields**: title, description, eventDate, eventTime, venue, capacity, category, status
- **Relationships**: References to User model for submittedBy and reviewedBy
- **Status Flow**: pending → approved/denied → completed
- **Features**: Feedback system, review notes, contact person details

## Page-by-Page Explanation

### 1. Landing Page (`LandingPage.js`)
**Purpose**: Public-facing homepage that introduces the platform to visitors
**Features**: Hero section with call-to-action buttons, feature highlights explaining platform benefits, step-by-step workflow guide, and user testimonials showcasing success stories
**Technology**: React functional component with conditional rendering based on authentication state

### 2. Registration Page (`RegisterPage.js`)
**Purpose**: User account creation with comprehensive form validation
**Features**: Multi-field form capturing personal and organizational details, real-time password confirmation, responsive form layout with optional fields, and error handling with user feedback
**Technology**: React hooks for state management, form validation, and controlled inputs

### 3. Login Page (`LoginPage.js`)
**Purpose**: User authentication portal with demo credentials display
**Features**: Simple login form with email/password fields, loading states during authentication, error message display, and demo account information for testing
**Technology**: React Context API for authentication state, async/await for API calls

### 4. User Dashboard (`UserDashboard.js`)
**Purpose**: Primary interface for regular users to manage their event requests
**Features**: Event submission modal with comprehensive form fields, personal event history with status tracking, real-time status updates, and interactive event cards with detailed information
**Technology**: React hooks for complex state management, modal implementation, and dynamic form handling

### 5. Admin Dashboard (`AdminDashboard.js`)
**Purpose**: Administrative control center for managing all platform operations
**Features**: Tabbed interface for pending requests and all events, approval/denial workflow with comment system, analytics dashboard with statistics, and user management capabilities
**Technology**: Tab-based navigation, conditional rendering, and administrative API calls

### 6. Header Component (`Header.js`)
**Purpose**: Navigation bar with authentication-aware menu system
**Features**: Dynamic navigation based on user role and authentication status, logout functionality, and responsive design for mobile devices
**Technology**: React Router for navigation, Context API for authentication state

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - User authentication with JWT token
- `GET /api/auth/me` - Current user profile retrieval
- `PUT /api/auth/updateprofile` - User profile updates

### Event Management Endpoints
- `POST /api/events` - Event request submission
- `GET /api/events/my-events` - User's event history
- `GET /api/events/:id` - Single event details
- `PUT /api/events/:id` - Event updates (pending only)
- `POST /api/events/:id/feedback` - Event feedback submission

### Admin Endpoints
- `GET /api/admin/pending-events` - Pending approval requests
- `GET /api/admin/events` - All events with filtering
- `PUT /api/admin/events/:id/approve` - Event approval
- `PUT /api/admin/events/:id/deny` - Event denial
- `GET /api/admin/analytics` - System analytics and statistics

## Security Features

### Authentication Security
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Role-Based Access**: Middleware for protecting admin-only routes
- **Input Validation**: express-validator for sanitizing and validating user inputs

### API Security
- **CORS Configuration**: Controlled cross-origin requests
- **Request Validation**: Comprehensive input validation on all endpoints
- **Error Handling**: Consistent error responses without sensitive information exposure
- **Protected Routes**: Middleware authentication for all private endpoints

## Development Features

### Environment Configuration
- Development and production environment variables
- Database connection strings and JWT secrets
- Email service configuration (simulated for development)

### Development Tools
- Hot reload with nodemon for backend development
- React development server with live reloading
- VS Code tasks for automated development workflow
- Database seeding scripts for initial setup

## Deployment Considerations

### Production Requirements
- MongoDB Atlas or dedicated MongoDB server
- Environment variable configuration for production
- HTTPS configuration for secure JWT transmission
- Email service integration (SendGrid, Mailgun, etc.)
- Static file serving for React build
- Process management (PM2) for Node.js application

### Performance Optimizations
- Database indexing for frequently queried fields
- React component optimization with proper key props
- API response pagination for large datasets
- Image optimization and lazy loading for better performance

## Testing Strategy

### Backend Testing
- Unit tests for individual functions and middleware
- Integration tests for API endpoints
- Database connection and query testing
- Authentication flow testing

### Frontend Testing
- Component unit testing with React Testing Library
- User interaction testing
- Authentication flow testing
- Responsive design testing across devices

This technical documentation provides a comprehensive overview of the Event Management System's architecture, technologies, and implementation details for report writing and technical explanation purposes.
