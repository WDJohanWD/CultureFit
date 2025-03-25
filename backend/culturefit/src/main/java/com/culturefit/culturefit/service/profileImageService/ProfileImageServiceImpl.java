package com.culturefit.culturefit.service.profileImageService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.exception.profileImageExceptions.ErrorSavingImageException;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class ProfileImageServiceImpl implements ProfileImageService {
    // Cargar configuración del entorno
    Dotenv dotenv = Dotenv.load();
    String DIRECTORY_PROFILE_IMAGES = dotenv.get("DIRECTORY_PROFILE_IMAGES");

    public String guardarImagen(Long usuarioId, MultipartFile archivo, String nombreUsuario) throws IOException {
        try {
            File directorio = new File(DIRECTORY_PROFILE_IMAGES);

            if (!directorio.exists()) {
                directorio.mkdirs(); // Crear directorio si no existe
            }

            // Obtener y validar la extensión
            String extension = obtenerExtension(archivo.getOriginalFilename()).toLowerCase();
            if (!extension.matches("\\.(jpg|jpeg|png|gif)$")) {
                throw new RuntimeException();
            }

            // Normalizar el nombre del archivo
            String nombreArchivo = nombreUsuario.replaceAll("\\s+", "_").toLowerCase() + "_profile" + extension;

            // Construcción correcta de la ruta
            Path rutaArchivo = Paths.get(directorio.getAbsolutePath(), nombreArchivo);

            // Guardar el archivo
            Files.write(rutaArchivo, archivo.getBytes());

            // Devolver la URL de acceso
            return "/uploads/profileImages/" + nombreArchivo;
            
        } catch (Exception e) {
            throw new ErrorSavingImageException();
        }
    }

    public String obtenerExtension(String nombreArchivo) {
        int indiceExtension = nombreArchivo.lastIndexOf(".");
        if (indiceExtension == -1) {
            return ""; // Si no tiene extensión, devolver una cadena vacía
        }
        return nombreArchivo.substring(indiceExtension);
    }
}
