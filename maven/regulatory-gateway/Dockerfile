FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY maven ./maven
RUN mvn -B -ntp -pl maven/regulatory-gateway -am verify

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 10001 comeaux
COPY --from=build /workspace/maven/regulatory-gateway/target/regulatory-gateway-*.jar /app/app.jar
USER 10001
EXPOSE 8080
ENTRYPOINT ["java","-XX:+UseContainerSupport","-jar","/app/app.jar"]
