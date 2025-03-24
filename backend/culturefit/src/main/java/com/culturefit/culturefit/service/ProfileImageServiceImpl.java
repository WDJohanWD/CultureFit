package com.culturefit.culturefit.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.github.cdimascio.dotenv.Dotenv;

//TODO:Manejar errores
@Service
public class ProfileImageServiceImpl implements ProfileImageService{
    // Inicialización de la direccion del directiorio de imagenes de perfil
    Dotenv dotenv = Dotenv.load();
    String DIRECTORY_PROFILE_IMAGES = dotenv.get("DIRECTORY_PROFILE_IMAGES");

    public String guardarImagen(Long usuarioId, MultipartFile archivo, String nombreUsuario) throws IOException {
        // Crear el directorio si no existe
        File directorio = new File(DIRECTORY_PROFILE_IMAGES);
        if (!directorio.exists()) {
            directorio.mkdirs();
        }

        String extension = obtenerExtension(archivo.getOriginalFilename());

        String nombreArchivo = nombreUsuario + "_profile" + extension;

        Path rutaArchivo = Paths.get(DIRECTORY_PROFILE_IMAGES + nombreArchivo);

        // Guardar el archivo en la carpeta
        Files.write(rutaArchivo, archivo.getBytes());

        // Devolver la URL
        return "/uploads/profileImages/" + nombreArchivo;
    }

    public String obtenerExtension(String nombreArchivo) {
        int indiceExtension = nombreArchivo.lastIndexOf(".");
        if (indiceExtension == -1) {
            return ""; // Si no tiene extensión, devolver una cadena vacía
        }
        return nombreArchivo.substring(indiceExtension);
    }
}
