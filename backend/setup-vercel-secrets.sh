#!/bin/bash

# Script to add all required secrets to Vercel

echo "🔐 Setting up Vercel secrets for StuHouses backend"

# Database URL (replace with your production database URL)
echo "Enter your production DATABASE_URL:"
read -s database_url
echo "Adding database_url secret..."
vercel secrets add database_url "$database_url"

# JWT Secret (generate a random one if not provided)
echo "Enter your JWT_SECRET (leave blank to generate one):"
read -s jwt_secret
if [ -z "$jwt_secret" ]; then
  jwt_secret=$(openssl rand -hex 32)
  echo "Generated a random JWT secret"
fi
echo "Adding jwt_secret secret..."
vercel secrets add jwt_secret "$jwt_secret"

# Stripe keys
echo "Enter your STRIPE_SECRET_KEY:"
read -s stripe_secret_key
echo "Adding stripe_secret_key secret..."
vercel secrets add stripe_secret_key "$stripe_secret_key"

echo "Enter your STRIPE_WEBHOOK_SECRET:"
read -s stripe_webhook_secret
echo "Adding stripe_webhook_secret secret..."
vercel secrets add stripe_webhook_secret "$stripe_webhook_secret"

echo "✅ All secrets have been added to Vercel"
echo "You can now run 'vercel' to deploy your backend" 