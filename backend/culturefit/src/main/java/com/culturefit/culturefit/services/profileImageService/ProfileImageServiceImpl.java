package com.culturefit.culturefit.services.profileImageService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.exceptions.profileImageExceptions.ErrorSavingImageException;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class ProfileImageServiceImpl implements ProfileImageService {
    // Cargar configuración del entorno
    Dotenv dotenv = Dotenv.load();
    String DIRECTORY_PROFILE_IMAGES = dotenv.get("DIRECTORY_PROFILE_IMAGES");

    @Override
    public String saveImage(Long userId, MultipartFile file, String userName) throws IOException {
        try {
            File directory = new File(DIRECTORY_PROFILE_IMAGES);

            if (!directory.exists()) {
                directory.mkdirs(); // Crear directorio si no existe
            }

            // Obtener y validar la extensión
            String extension = getExtension(file.getOriginalFilename()).toLowerCase();
            if (!extension.matches("\\.(jpg|jpeg|png|gif)$")) {
                throw new RuntimeException();
            }

            // Normalizar el nombre del archivo
            String fileName = userName.replaceAll("\\s+", "_").toLowerCase() + "_profile" + extension;

            // Construcción correcta de la ruta
            Path filePath = Paths.get(directory.getAbsolutePath(), fileName);

            // Guardar el archivo
            Files.write(filePath, file.getBytes());

            // Devolver la URL de acceso
            return "/uploads/profileImages/" + fileName;
            
        } catch (Exception e) {
            throw new ErrorSavingImageException();
        }
    }

    @Override
    public String getExtension(String fileName) {
        int extensionIndex = fileName.lastIndexOf(".");
        if (extensionIndex == -1) {
            return ""; // Si no tiene extensión, devolver una cadena vacía
        }
        return fileName.substring(extensionIndex);
    }
}

