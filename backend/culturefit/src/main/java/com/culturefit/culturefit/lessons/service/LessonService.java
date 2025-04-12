package com.culturefit.culturefit.lessons.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;

public interface LessonService {

    Lesson createLesson(String lessonName, String lessonDescription);

    Lesson getLesson(Long id);

    List<Lesson> getLessons();

    Lesson save(Lesson lesson, MultipartFile file);

    Lesson updateLesson(Long id, String lessonName, String lessonDescription, MultipartFile file) throws IOException;

    void deleteLesson(Long id);

    String uploadLesson(MultipartFile file, String lessonName) throws IOException;

    String getExtension(String fileName);
}
