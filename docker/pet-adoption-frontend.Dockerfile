# Stage 1: Build the React app
FROM node:20 AS build
WORKDIR /app

# Copy only package.json and yarn.lock to cache dependencies
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the frontend code
COPY pet-adoption-frontend/ .

# Build the Next.js app
RUN yarn run build

# Stage 2: Create the final image
FROM node:20
WORKDIR /app

# Copy the build artifacts from the previous stage
COPY --from=build /app/.next ./next

# Copy package.json to /app so yarn can run the app
COPY pet-adoption-frontend/package.json ./

# Install only production dependencies
RUN yarn install --production

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]
