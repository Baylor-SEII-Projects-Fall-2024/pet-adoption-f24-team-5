this is my docker file:

# Create a build of the project
FROM node:20 AS build
WORKDIR /build
COPY . .

WORKDIR /build/pet-adoption-frontend
RUN yarn install
RUN yarn run build

# Copy the build artifacts
FROM node:20
WORKDIR /app
COPY --from=build /build .

# Run the app
ENTRYPOINT exec yarn start
