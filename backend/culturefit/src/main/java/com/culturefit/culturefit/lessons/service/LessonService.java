package com.culturefit.culturefit.lessons.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;

public interface LessonService {
    
    // Obtener una lección por ID
    Lesson getLesson(Long id);

    // Obtener todas las lecciones
    List<Lesson> getLessons();

    // Crear una lección (instancia sin guardar)
    Lesson createLesson(String lessonName, String lessonDescription);

    // Guardar una lección nueva con archivos de video y miniatura
    Lesson save(Lesson lesson, MultipartFile file, MultipartFile thumbnail);

    // Actualizar una lección existente (opcionalmente actualizar video)
    Lesson updateLesson(Long id, String lessonName, String lessonDescription, MultipartFile file) throws IOException;

    // Eliminar una lección por ID
    void deleteLesson(Long id);
}
