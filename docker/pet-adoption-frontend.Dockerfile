# Stage 1: Build the Next.js app
FROM node:20 AS build
WORKDIR /app

# Copy only package.json and yarn.lock to cache dependencies
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./

# Install all dependencies (including development dependencies)
RUN yarn install

# Copy the rest of the frontend code
COPY pet-adoption-frontend/ .

# Build the Next.js app
RUN yarn build

# Stage 2: Create the final image
FROM node:20
WORKDIR /app

# Copy the build artifacts from the previous stage
COPY --from=build /app/.next ./.next

# Copy the public folder if it exists
COPY --from=build /app/public ./public

# Copy the package.json and install only production dependencies
COPY pet-adoption-frontend/package.json ./
RUN yarn install --production

# Expose the app's port
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]
