package com.culturefit.culturefit.lessons.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

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
    private final Dotenv dotenv = Dotenv.load();
    private final String DIRECTORY_LESSON_VIDEOS = dotenv.get("DIRECTORY_LESSON_VIDEOS");

    // Crear una lección (sin guardar en BD todavía)
    public Lesson createLesson(String lessonName, String lessonDescription) {
        return new Lesson(
                null,
                lessonName,
                lessonDescription,
                null,
                null
        );
    }

    // Obtener una lección por ID
    public Lesson getLesson(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se ha encontrado la lección"));
    }

    // Obtener todas las lecciones
    public List<Lesson> getLessons() {
        return repository.findAll();
    }

    // Guardar una lección con video
    public Lesson save(Lesson lesson, MultipartFile file) {
        try {
            String videoUrl = uploadLesson(file, lesson.getName());
            lesson.setVideoUrl(videoUrl);
            lesson.setUploadDate(LocalDate.now());
            return repository.save(lesson);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar la lección", e);
        }
    }

    // Subir un archivo de video y devolver la URL
    public String uploadLesson(MultipartFile file, String lessonName) throws IOException {
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

            // Ruta donde se guardará el archivo
            Path filePath = Paths.get(directory.getAbsolutePath(), fileName);

            // Guardar el archivo en disco
            Files.write(filePath, file.getBytes());

            // Devolver la ruta relativa de acceso al video
            return "/uploads/profileLessons/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Error al subir el video", e);
        }
    }

    public Lesson updateLesson(Long id, String lessonName, String lessonDescription, MultipartFile file) throws IOException {
        // Obtener lección existente
        Lesson existingLesson = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lección no encontrada"));

        // Actualizar nombre y descripción
        existingLesson.setName(lessonName);
        existingLesson.setDescription(lessonDescription);

        // Si se proporciona un archivo, actualizar el video
        if (file != null && !file.isEmpty()) {
            String videoUrl = uploadLesson(file, lessonName); // Subir el nuevo video
            existingLesson.setVideoUrl(videoUrl);
        }

        // Guardar la lección actualizada
        return repository.save(existingLesson);
    }

    // Eliminar una lección por ID
    public void deleteLesson(Long id) {
        getLesson(id); // Verifica existencia
        repository.deleteById(id);
    }

    // Obtener la extensión del archivo
    public String getExtension(String fileName) {
        int extensionIndex = fileName.lastIndexOf(".");
        if (extensionIndex == -1) {
            return "";
        }
        return fileName.substring(extensionIndex);
    }
}
