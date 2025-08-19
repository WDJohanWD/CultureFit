package com.culturefit.culturefit.lessons.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;

public interface LessonService {
    
    // Obtener una lección por ID
    Lesson getLesson(Long id);

    // Obtener todas las lecciones
    List<Lesson> getLessons();

    // Crear una lección (instancia sin guardar)
    
    Lesson createLesson(String lessonNameES, String lessonNameEN, String lessonNameGL, String lessonDescriptionES, String lessonDescriptionEN, String lessonDescriptionGL);

    // Guardar una lección nueva con archivos de video y miniatura
    Lesson save(Lesson lesson, MultipartFile file, MultipartFile thumbnail);

    // Eliminar una lección por ID
    void deleteLesson(Long id);
}
