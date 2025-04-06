#!/bin/bash

# StuHouses Database Setup Script
echo "🗄️ StuHouses Database Setup"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for PostgreSQL
if ! command_exists psql; then
  echo "❌ PostgreSQL client not found. Please install PostgreSQL to continue."
  exit 1
fi

# Get database connection details
read -p "Enter database host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter database port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Enter database name: " DB_NAME
while [[ -z "$DB_NAME" ]]; do
  echo "Database name cannot be empty"
  read -p "Enter database name: " DB_NAME
done

read -p "Enter database user: " DB_USER
while [[ -z "$DB_USER" ]]; do
  echo "Database user cannot be empty"
  read -p "Enter database user: " DB_USER
done

read -sp "Enter database password: " DB_PASSWORD
echo ""
while [[ -z "$DB_PASSWORD" ]]; do
  echo "Database password cannot be empty"
  read -sp "Enter database password: " DB_PASSWORD
  echo ""
done

# Create .env file with database connection info
echo "📝 Creating .env file in backend directory..."
cat > backend/.env << EOF
# Environment settings
NODE_ENV=production
PORT=5000

# Database settings
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Database Configuration
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

# Frontend URL for CORS (update after deployment)
FRONTEND_URL=http://localhost:3000

# JWT Secret for authentication (replace with a strong secret)
JWT_SECRET=$(openssl rand -hex 32)

# JWT Authentication
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Email Configuration (update with your SMTP provider details)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@stuhouses.com

# Stripe Payment Integration (update with your Stripe keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Google Maps API for property locations
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs
EOF

echo "✅ .env file created successfully"

# Test the database connection
echo "🔄 Testing database connection..."
export PGPASSWORD="$DB_PASSWORD"
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
  echo "✅ Database connection successful"
else
  echo "❌ Could not connect to the database. Please check your connection details."
  exit 1
fi

# Run database migrations
echo "🔄 Running database migrations..."
cd backend
if ! command_exists npm; then
  echo "❌ npm not found. Please install Node.js and npm to continue."
  exit 1
fi

npm install
npm run db:migrate

if [ $? -eq 0 ]; then
  echo "✅ Database migrations completed successfully"
else
  echo "❌ Database migrations failed"
  exit 1
fi

echo ""
echo "📋 Database setup completed. Summary:"
echo "- Database host: $DB_HOST:$DB_PORT"
echo "- Database name: $DB_NAME"
echo "- Database user: $DB_USER"
echo "- Environment file created: backend/.env"
echo "- Database migrations applied"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your production environment settings"
echo "2. Deploy your application using the deploy.sh script"
echo ""
echo "Thanks for using StuHouses database setup script!" 