# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B -q
COPY src ./src
RUN mvn clean package -DskipTests -B -q

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S nexus && adduser -S nexus -G nexus
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN chown nexus:nexus app.jar
USER nexus

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -q --spider http://localhost:8080/api/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=70.0", \
    "-XX:+UseG1GC", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
