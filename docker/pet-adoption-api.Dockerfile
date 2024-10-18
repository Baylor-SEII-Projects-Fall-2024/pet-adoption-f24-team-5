# Create a build of the project
FROM gradle:8.9.0-jdk22 AS build
WORKDIR /build
COPY . .
# Change to pet-adoption-api to run ./gradlew
WORKDIR /build/pet-adoption-api
RUN ./gradlew build --no-daemon

# Copy the build artifacts
FROM openjdk:22
WORKDIR /app
COPY --from=build /build/build/libs/pet-adoption-api-1.0.0-SNAPSHOT.jar app.jar

# Run the app
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar
