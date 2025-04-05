package com.culturefit.culturefit.lessons.service;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;

public interface LessonService {
    Lesson createLesson(String lessonName, String lessonDescription);
    Lesson save(Lesson lesson, MultipartFile file);
}
