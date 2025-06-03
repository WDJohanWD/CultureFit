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
        @RequestParam("nameES") String lessonNameES,
        @RequestParam("nameEN") String lessonNameEN,
        @RequestParam("descriptionES") String lessonDescriptionES,
        @RequestParam("descriptionEN") String lessonDescriptionEN) {

        Lesson createdLesson = lessonService.createLesson(lessonNameES, lessonNameEN, lessonDescriptionES, lessonDescriptionEN);
        Lesson savedLesson = lessonService.save(createdLesson, file, thumbnail);
        
        return ResponseEntity.ok(savedLesson);
    }

    @DeleteMapping("/delete-lesson/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);;
        return ResponseEntity.ok(null);
    }
}
