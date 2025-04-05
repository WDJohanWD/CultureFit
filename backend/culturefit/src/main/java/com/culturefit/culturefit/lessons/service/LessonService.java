package com.culturefit.culturefit.lessons.service;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;

public interface LessonService {
    Lesson save(Lesson lesson, MultipartFile file);
}
