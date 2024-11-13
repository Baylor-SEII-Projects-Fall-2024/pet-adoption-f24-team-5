FROM openjdk:23

WORKDIR /spring

COPY pet-adoption-api/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Create the user and necessary directories with appropriate permissions
RUN mkdir -p /tmp/uploads && \
    chmod -R 777 /tmp/uploads

# Switch to the created non-root user
USER root
