# UniHomes - Student Accommodation Platform

A comprehensive platform for streamlining the search for all-inclusive student accommodations across the UK.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [Deployment](#deployment)
- [License](#license)

## Features

### For Students
- Search for student accommodations by city or university
- Filter properties by bedrooms, price, and amenities
- View property details with high-quality images
- Save favorite properties to a shortlist
- All-inclusive utility packages (gas, electricity, water, broadband, TV license)
- User registration and profile management

### For Letting Agents
- Agent portal for property management
- Add and update property listings
- Track and respond to inquiries
- View analytics and performance metrics

## Tech Stack

### Frontend
- **Next.js** - React framework with server-side rendering
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Heroicons** - SVG icon set
- **React Hot Toast** - Notifications library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **Knex.js** - SQL query builder
- **JWT** - Authentication
- **Winston** - Logging library
- **Helmet** - Security middleware

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL (v13 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/unihomes.git
   cd unihomes
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

## Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory using the provided `.env.example` as a template:

```bash
cp backend/.env.example backend/.env
```

Update the values in the `.env` file:

- `PORT` - Backend server port (default: 5000)
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: unihomes_dev)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT tokens (generate a strong random string)
- `JWT_EXPIRES_IN` - JWT token expiration time (e.g., "7d" for 7 days)

### Frontend Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Database Setup

1. Create a PostgreSQL database:
   ```bash
   createdb unihomes_dev
   ```

2. Run database migrations:
   ```bash
   cd backend
   npm run db:migrate
   ```

3. Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## API Documentation

API endpoints are organized by resource:

- `GET /api/health` - API health check
- `/api/cities` - City-related endpoints
- `/api/universities` - University-related endpoints
- `/api/properties` - Property-related endpoints
- `/api/agents` - Agent-related endpoints
- `/api/users` - User-related endpoints
- `/api/blog` - Blog-related endpoints

For detailed API documentation, refer to the inline comments in the route files.

## Folder Structure

```
unihomes/
├── backend/                  # Backend API
│   ├── src/                  # Source code
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Request handlers
│   │   ├── database/         # Migrations and seeds
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   └── server.js         # Entry point
│   └── ...
├── frontend/                 # Next.js frontend
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Next.js pages
│   │   ├── styles/           # Global styles
│   │   └── utils/            # Utility functions
│   └── ...
└── ...
```

## Deployment

### Backend Deployment

The backend can be deployed to platforms like Heroku, Digital Ocean, or AWS:

1. Set up environment variables on the hosting platform
2. Configure the database connection string
3. Set the `NODE_ENV` environment variable to "production"

### Frontend Deployment

The Next.js frontend can be deployed to Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy the application

## License

This project is licensed under the MIT License.

---

## Configuration Items

The following items need to be configured before running the application:

1. **Database Connection**: Update the PostgreSQL connection details in `.env` file
2. **JWT Secret**: Set a secure random string as JWT_SECRET in `.env` file
3. **Email Configuration**: Configure the email provider details for password resets

For a production deployment, additional configuration may be required for:

1. **SSL/TLS**: Configure SSL certificates for HTTPS
2. **CDN**: Set up a CDN for serving static assets
3. **Monitoring**: Implement uptime and performance monitoring 