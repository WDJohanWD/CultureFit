# Usa una imagen de Java para correr el jar
FROM openjdk:23-jdk-slim

# Crea un directorio dentro del contenedor
WORKDIR /app

# Copia el .jar compilado al contenedor
COPY target/culturefit-0.0.1-SNAPSHOT.jar app.jar
COPY .env .env

# Expone el puerto
EXPOSE 9000

# Comando para ejecutar el jar
ENTRYPOINT ["java", "-jar", "app.jar"]
