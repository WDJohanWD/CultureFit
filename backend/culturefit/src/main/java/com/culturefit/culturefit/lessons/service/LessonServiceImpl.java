package com.culturefit.culturefit.lessons.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;
import com.culturefit.culturefit.lessons.repository.LessonRepository;

import io.github.cdimascio.dotenv.Dotenv;

// TODO: Tocar manejo de extensiones
@Service
public class LessonServiceImpl implements LessonService{
    @Autowired
    private LessonRepository repository;

    // Cargar configuración del entorno
    Dotenv dotenv = Dotenv.load();
    String DIRECTORY_LESSON_VIDEOS = dotenv.get("DIRECTORY_LESSON_VIDEOS");

    @Override
    public Lesson save(Lesson lesson, MultipartFile file) {
        try {
            String videoUrl = uploadLesson(file, lesson.getName());
            lesson.setVideoUrl(videoUrl);
            lesson.setUploadDate(LocalDate.now());
            return repository.save(lesson);
        } catch (Exception e) {
            throw new RuntimeException();
        }
        
    }

    private String uploadLesson(MultipartFile file, String lessonName) throws IOException{
        try {
            File directory = new File(DIRECTORY_LESSON_VIDEOS);

            if (!directory.exists()) {
                directory.mkdirs(); // Crear directorio si no existe
            }

            // Obtener y validar la extensión
            String extension = getExtension(file.getOriginalFilename()).toLowerCase();
            if (!extension.matches("\\.(mp4|avi|mov|mkv|webm|flv|wmv)$")) {
                throw new RuntimeException("Formato de video no válido");
            }
            
            // Normalizar el nombre del archivo
            String fileName = lessonName.replaceAll("\\s+", "_").toLowerCase() + "_video" + extension;

            // Construcción correcta de la ruta
            Path filePath = Paths.get(directory.getAbsolutePath(), fileName);

            // Guardar el archivo
            Files.write(filePath, file.getBytes());

            // Devolver la URL de acceso
            return "/uploads/profileLessons/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    public String getExtension(String fileName) {
        int extensionIndex = fileName.lastIndexOf(".");
        if (extensionIndex == -1) {
            return ""; // Si no tiene extensión, devolver una cadena vacía
        }
        return fileName.substring(extensionIndex);
    }
}
