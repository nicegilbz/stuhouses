FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the application if needed
RUN npm run build --if-present

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/src ./src
COPY --from=builder /app/knexfile.js ./
COPY --from=builder /app/vercel.json ./

# Create required directories
RUN mkdir -p logs

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "src/server.js"] 