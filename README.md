# StuHouses - Student Accommodation Platform

StuHouses is a comprehensive student accommodation platform that helps students find and book accommodation with all bills included.

## Features

- User authentication and account management
- Property search by city or university
- Property details and booking
- Payment processing with Stripe
- Multilingual support
- Admin dashboard for property management
- Student-friendly interface

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payment**: Stripe
- **Deployment**: Vercel

## Project Structure

The project is divided into two main directories:

- `frontend/`: Contains the Next.js application
- `backend/`: Contains the Express API server

## Local Development

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the example environment file:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your database and other configuration details

5. Run database migrations:
   ```
   npm run db:migrate
   ```

6. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Deployment

### Using Vercel

The easiest way to deploy StuHouses is using Vercel. We've included a deployment script to make this process simple.

#### Prerequisites

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to your Vercel account:
   ```
   vercel login
   ```

#### Deployment Steps

1. Make the deployment script executable:
   ```
   chmod +x deploy.sh
   ```

2. Run the deployment script:
   ```
   ./deploy.sh
   ```

3. Follow the prompts to deploy both the backend and frontend

#### Manual Deployment

If you prefer to deploy manually, follow these steps:

1. Deploy the backend:
   ```
   cd backend
   vercel --prod
   ```

2. Note the URL of your deployed backend API

3. Deploy the frontend with the backend URL:
   ```
   cd frontend
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api vercel --prod
   ```

### Environment Variables

Remember to set up the following environment variables in your Vercel deployment:

#### Backend Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `FRONTEND_URL`: URL of your frontend application
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`: SMTP configuration
- `GOOGLE_MAPS_API_KEY`: Google Maps API key

#### Frontend Environment Variables

- `NEXT_PUBLIC_API_URL`: URL of your backend API
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please reach out to [support@stuhouses.com](mailto:support@stuhouses.com). 