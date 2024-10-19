# Stage 1: Build the React app
FROM node:20 AS build
WORKDIR /build

# Copy only package.json and yarn.lock first (to cache dependencies installation)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Now copy the rest of the source code
COPY . .

# Build the app
RUN yarn run build

# Stage 2: Create a minimal image to run the app
FROM node:20
WORKDIR /app

# Copy only the build artifacts from the previous stage
COPY --from=build /build/build ./build

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Expose the port that your app will run on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
