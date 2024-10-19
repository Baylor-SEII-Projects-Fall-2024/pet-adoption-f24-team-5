# Stage 1: Build the Next.js app
FROM node:20 AS build
WORKDIR /app

# Copy only necessary files to avoid invalidating the cache
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./

# Install all dependencies (including development dependencies)
RUN yarn install --frozen-lockfile

# Copy the rest of the frontend code
COPY pet-adoption-frontend/ .

# Build the Next.js app
RUN yarn build

# Stage 2: Create the final image
FROM node:20
WORKDIR /app

# Copy build artifacts from the previous stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Copy package.json and yarn.lock
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./

# Install production dependencies
RUN yarn install --frozen-lockfile --production

# Expose the app's port
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]
