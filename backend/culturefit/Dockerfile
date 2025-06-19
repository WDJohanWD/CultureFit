# Usa una imagen de Java para correr el jar
FROM eclipse-temurin:23-jre-alpine

# Crea un directorio dentro del contenedor
WORKDIR /app

# Copia el .jar compilado al contenedor
COPY target/culturefit-0.0.1-SNAPSHOT.jar app.jar

# Copia el archivo .env al directorio /app del contenedor
COPY .env .env

# Expone el puerto
EXPOSE 9000

# Comando para ejecutar el jar
CMD ["java", "-jar", "app.jar"]