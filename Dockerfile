# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies needed for build)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the NestJS application into the /dist directory
RUN npm run build

# Stage 2: Install production dependencies only
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
# Install ONLY production dependencies to keep the image small
RUN npm ci --omit=dev

# Stage 3: Production final image
FROM node:22-alpine AS prod

WORKDIR /app

# Run as non-root user for security
USER node

# Copy package.json (needed for npm run start:prod)
COPY --chown=node:node package*.json ./

# Copy only production dependencies from the deps stage
COPY --chown=node:node --from=deps /app/node_modules ./node_modules

# Copy the compiled application from the builder stage
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3005

# Run the compiled javascript directly (much faster than 'nest start')
CMD ["npm", "run", "start:prod"]
