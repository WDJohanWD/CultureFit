package com.culturefit.culturefit.lessons.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;
import com.culturefit.culturefit.lessons.service.LessonService;
import org.springframework.web.bind.annotation.RequestPart;

@RestController
public class LessonController {
    @Autowired
    private LessonService lessonService;

    @PostMapping(value = "/save-lesson", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postLesson(@RequestPart("file") MultipartFile file, @RequestPart("lesson") Lesson lesson) {
        Lesson lessonSaved = lessonService.save(lesson, file);

        return ResponseEntity.ok(lessonSaved);
    }
}
