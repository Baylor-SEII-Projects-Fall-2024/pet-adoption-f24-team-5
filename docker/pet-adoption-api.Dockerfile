# Stage 1: Build the project
FROM gradle:8.9.0-jdk22 AS build
WORKDIR /build

# Copy all project files into the build directory
COPY . .

# Change to the pet-adoption-api directory to run the Gradle build
WORKDIR /build/pet-adoption-api

# Run the Gradle build to generate the JAR file
RUN ./gradlew clean build --no-daemon

# Stage 2: Create a lightweight image with the built JAR and setup volume directory
FROM openjdk:22
WORKDIR /app

# Copy the JAR from the previous build stage to the /app directory
COPY --from=build /build/pet-adoption-api/build/libs/pet-adoption-api-1.0.0-SNAPSHOT.jar app.jar

# Copy the resources folder into the image
COPY --from=build /build/pet-adoption-api/src/main/resources/ /app/resources/

# Create a directory for file uploads and set permissions
RUN mkdir -p /tmp/uploads && \
    chmod -R 777 /tmp/uploads

# Expose port 8080 for the backend service
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
