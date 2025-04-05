package com.culturefit.culturefit.lessons.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/save-lesson")
    public ResponseEntity<?> postLesson(
        @RequestParam("file") MultipartFile file,
        @RequestParam("name") String lessonName,
        @RequestParam("description") String lessonDescription) {

        Lesson createdLesson = lessonService.createLesson(lessonName, lessonDescription);
        Lesson savedLesson = lessonService.save(createdLesson, file);
        
        return ResponseEntity.ok(savedLesson);
    }
}
