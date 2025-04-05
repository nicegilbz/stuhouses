# StuHouses - Student Accommodation Platform

StuHouses is a comprehensive web application designed to help students find and book accommodation near their universities.

## Features

- **Property Search**: Filter properties by city, university, price, bedrooms, and more
- **Interactive Maps**: View property locations on an interactive map
- **University Listings**: Browse properties by university
- **User Accounts**: Save favorite properties and manage bookings
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, React
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Knex.js
- **Authentication**: JWT-based authentication

## Project Structure

```
stuhouses/
├── frontend/        # Next.js frontend application
├── backend/         # Express.js backend API
├── package.json     # Root package.json for development scripts
└── README.md        # This file
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nicegilbz/stuhouses.git
   cd stuhouses
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the backend directory
   - Create `.env.local` file in the frontend directory

4. Set up the database:
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

5. Start the development servers:
   ```bash
   # From the root directory
   npm run dev
   ```

## Development

- Frontend will be available at: http://localhost:3000
- Backend API will be available at: http://localhost:5000/api

## Deployment

This application can be deployed using Vercel:

1. Deploy the frontend to Vercel
2. Deploy the backend to Vercel Serverless Functions
3. Set up a PostgreSQL database (Vercel Postgres or similar)

## License

[MIT](LICENSE) 