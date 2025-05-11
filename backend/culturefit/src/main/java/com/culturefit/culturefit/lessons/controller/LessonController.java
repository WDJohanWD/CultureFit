package com.culturefit.culturefit.lessons.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;
import com.culturefit.culturefit.lessons.service.LessonService;

@RestController
public class LessonController {
    @Autowired
    private LessonService lessonService;

    @GetMapping("/lesson/{id}")
    public ResponseEntity<Lesson> getLesson(@PathVariable Long id) {
        Lesson lesson = lessonService.getLesson(id);
        return ResponseEntity.ok(lesson);
    }

    @GetMapping("/lessons")
    public ResponseEntity<List<Lesson>> getLessons() {
        List<Lesson> lessons = lessonService.getLessons();
        return ResponseEntity.ok(lessons);
    }

    @PostMapping("/save-lesson")
    public ResponseEntity<?> postLesson(
        @RequestParam("thumbnail") MultipartFile thumbnail,
        @RequestParam("file") MultipartFile file,
        @RequestParam("name") String lessonName,
        @RequestParam("description") String lessonDescription) {

        Lesson createdLesson = lessonService.createLesson(lessonName, lessonDescription);
        Lesson savedLesson = lessonService.save(createdLesson, file, thumbnail);
        
        return ResponseEntity.ok(savedLesson);
    }

    @PutMapping("/update-lesson/{id}")
    public ResponseEntity<?> updateLesson(
        @PathVariable Long id,
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam("name") String lessonName,
        @RequestParam("description") String lessonDescription) {

        try {
            // Delegar la actualización al servicio
            Lesson updatedLesson = lessonService.updateLesson(id, lessonName, lessonDescription, file);
    
            return ResponseEntity.ok(updatedLesson);
    
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Lección no encontrada
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar la lección.");
        }
    }

}
