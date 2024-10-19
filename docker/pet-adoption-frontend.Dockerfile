# Stage 1: Build the React app
FROM node:20 AS build
WORKDIR /build

# Copy only the package.json and yarn.lock to install dependencies
COPY ./package.json ./yarn.lock ./

# Install dependencies
RUN yarn install

# Now copy the rest of the source code
COPY . .

# Build the app
RUN yarn run build

# Stage 2: Create a lightweight image to serve the app
FROM node:20
WORKDIR /app

# Copy the built app from the previous stage
COPY --from=build /build/build ./build

# Install only production dependencies
COPY ./package.json ./yarn.lock ./
RUN yarn install --production

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
