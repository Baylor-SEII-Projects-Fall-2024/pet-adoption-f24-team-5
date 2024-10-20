# Create a build of the project
FROM gradle:8.9.0-jdk22 AS build
WORKDIR /build

# Copy all the project files into the build directory
COPY . .

# Change to the pet-adoption-api directory to run the Gradle build
WORKDIR /build/pet-adoption-api

# Run the Gradle build to generate the JAR file
RUN ./gradlew build --no-daemon

# Final Stage: Create a lightweight image with the built JAR
FROM openjdk:22
WORKDIR /app

# Copy the JAR from the previous build stage to the /app directory
COPY --from=build /build/pet-adoption-api/build/libs/pet-adoption-api-1.0.0-SNAPSHOT.jar app.jar

# Run the application
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar
