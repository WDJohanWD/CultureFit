package com.culturefit.culturefit.lessons.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;
import com.culturefit.culturefit.lessons.service.LessonService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Controlador de lecciones", description = "Controlador para gestionar las lecciones.")
@RestController
public class LessonController {
    @Autowired
    private LessonService lessonService;

    @Operation(summary = "Obtener una lección por ID", description = "Devuelve los datos de una lección por su ID.")
    @Parameter(name = "id", description = "Id de la lección", required = true)
    @GetMapping("/lesson/{id}")
    public ResponseEntity<Lesson> getLesson(@PathVariable Long id) {
        Lesson lesson = lessonService.getLesson(id);
        return ResponseEntity.ok(lesson);
    }

    @Operation(summary = "Obtener todas las lecciones", description = "Devuelve una lista de todas las lecciones.")
    @GetMapping("/lessons")
    public ResponseEntity<List<Lesson>> getLessons() {
        List<Lesson> lessons = lessonService.getLessons();
        return ResponseEntity.ok(lessons);
    }

    @Operation(summary = "Crear una nueva lección", description = "Crea una nueva lección en la aplicación.")
    @PostMapping("/save-lesson")
    public ResponseEntity<?> postLesson(
        @RequestParam("thumbnail") MultipartFile thumbnail,
        @RequestParam("file") MultipartFile file,
        @RequestParam("nameES") String lessonNameES,
        @RequestParam("nameEN") String lessonNameEN,
        @RequestParam("descriptionES") String lessonDescriptionES,
        @RequestParam("descriptionEN") String lessonDescriptionEN) {

        Lesson createdLesson = lessonService.createLesson(lessonNameES, lessonNameEN, lessonDescriptionES, lessonDescriptionEN);
        Lesson savedLesson = lessonService.save(createdLesson, file, thumbnail);
        
        return ResponseEntity.ok(savedLesson);
    }
    @Operation(summary = "Actualizar una lección", description = "Actualiza los datos de una lección existente.")
    @Parameter(name = "id", description = "Id de la lección", required = true)
    @DeleteMapping("/delete-lesson/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.ok(null);
    }
}
