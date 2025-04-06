const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * This script ensures all necessary files are properly 
 * configured for deployment to Vercel
 */

console.log('🚀 Preparing for deployment...');

// Verify admin pages
const adminDir = path.join(__dirname, 'src', 'pages', 'admin');
if (!fs.existsSync(adminDir)) {
  console.error('❌ Admin directory not found!');
  process.exit(1);
}

const adminPages = fs.readdirSync(adminDir);
console.log('📝 Admin pages:', adminPages);

// Check if admin login page exists
const loginPath = path.join(adminDir, 'login.js');
if (!fs.existsSync(loginPath)) {
  console.error('❌ Admin login page not found!');
  process.exit(1);
}

console.log('✅ Admin login page found');

// Check middleware
const middlewarePath = path.join(__dirname, 'src', 'middleware.js');
if (!fs.existsSync(middlewarePath)) {
  console.error('❌ Middleware file not found!');
  process.exit(1);
}

console.log('✅ Middleware file found');

// Verify auth configuration
const authPath = path.join(__dirname, 'src', 'utils', 'auth.js');
if (!fs.existsSync(authPath)) {
  console.error('❌ Auth utility not found!');
  process.exit(1);
}

console.log('✅ Auth utility found');

// Verify API routes
const apiDir = path.join(__dirname, 'src', 'pages', 'api', 'admin');
if (!fs.existsSync(apiDir)) {
  console.error('❌ Admin API routes not found!');
  process.exit(1);
}

console.log('✅ Admin API routes found');

// Verify database service
const dbServicePath = path.join(__dirname, 'src', 'utils', 'dbService.js');
if (!fs.existsSync(dbServicePath)) {
  console.error('❌ Database service not found!');
  process.exit(1);
}

console.log('✅ Database service found');

// Verify jsconfig.json for proper path aliasing
const jsconfigPath = path.join(__dirname, 'jsconfig.json');
if (!fs.existsSync(jsconfigPath)) {
  console.error('❌ jsconfig.json not found!');
  process.exit(1);
}

console.log('✅ jsconfig.json found');

// Verify environment variables are properly set
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️ .env.local not found, using default environment variables');
} else {
  console.log('✅ Environment variables found');
}

// Check vercel.json configuration
const vercelPath = path.join(__dirname, 'vercel.json');
if (!fs.existsSync(vercelPath)) {
  console.warn('⚠️ vercel.json not found, will use default Vercel settings');
} else {
  console.log('✅ vercel.json found');
}

// Run build to check for errors
console.log('🔨 Running build to check for errors...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed with error:', error.message);
  process.exit(1);
}

console.log('✅ All checks passed. Ready for deployment!');
console.log('📋 Deployment checklist:');
console.log('1. Ensure PostgreSQL connection details are set in Vercel environment variables');
console.log('2. Make sure you\'ve pushed all changes to your repository');
console.log('3. Deploy through Vercel dashboard or CLI');
console.log('');
console.log('🌐 After deployment, access admin at: <your-domain>/admin/login');
console.log('🔑 Default admin credentials: admin@stuhouses.com / admin123'); 