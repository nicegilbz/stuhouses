#!/bin/bash

# StuHouses Deployment Script
echo "🚀 Starting StuHouses Deployment"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
if ! command_exists vercel; then
  echo "❌ Vercel CLI not found. Please install it with 'npm install -g vercel'"
  exit 1
fi

if ! command_exists git; then
  echo "❌ Git not found. Please install git to continue."
  exit 1
fi

# Make sure we have the latest code
echo "📥 Pulling latest changes from git..."
git pull

# Deploy Backend
echo "🔧 Deploying backend to Vercel..."
cd backend
# Install dependencies if needed
npm install

# Run database migrations (if needed)
read -p "Do you want to run database migrations? (y/n) " run_migrations
if [[ $run_migrations == "y" || $run_migrations == "Y" ]]; then
  echo "🗄️ Running database migrations..."
  npm run db:migrate
fi

# Deploy to Vercel
vercel --prod
if [ $? -ne 0 ]; then
  echo "❌ Backend deployment failed"
  exit 1
fi
echo "✅ Backend deployed successfully"

# Get the production URL to use for frontend
backend_url=$(vercel --prod -c --output=simple)
echo "🔗 Backend URL: $backend_url"

# Deploy Frontend
echo "🎨 Deploying frontend to Vercel..."
cd ../frontend
# Install dependencies if needed
npm install

# Deploy to Vercel with the backend URL
NEXT_PUBLIC_API_URL="$backend_url/api" vercel --prod --build-env NEXT_PUBLIC_API_URL="$backend_url/api"
if [ $? -ne 0 ]; then
  echo "❌ Frontend deployment failed"
  exit 1
fi
echo "✅ Frontend deployed successfully"

frontend_url=$(vercel --prod -c --output=simple)
echo "🔗 Frontend URL: $frontend_url"

# Update backend CORS settings with frontend URL
echo "🔄 Updating backend CORS settings..."
cd ../backend
FRONTEND_URL="$frontend_url" vercel --prod --build-env FRONTEND_URL="$frontend_url" -y

echo "🎉 Deployment complete! Your site is live at:"
echo "📱 Frontend: $frontend_url"
echo "🖥️ Backend API: $backend_url/api"
echo ""
echo "Remember to set up your environment variables in the Vercel dashboard:"
echo "- Stripe API keys"
echo "- Google Maps API key"
echo "- Email service credentials"
echo "- JWT secret"
echo "- Database connection string"
echo ""
echo "Thanks for using StuHouses deployment script!" 