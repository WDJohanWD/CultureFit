package com.culturefit.culturefit.lessons.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.lessons.domain.Lesson;
import com.culturefit.culturefit.lessons.repository.LessonRepository;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository repository;

    private final Dotenv dotenv = Dotenv.load();
    private final String DIRECTORY_LESSON_VIDEOS = dotenv.get("DIRECTORY_LESSON_VIDEOS");
    private final String DIRECTORY_LESSON_THUMBNAILS = dotenv.get("DIRECTORY_LESSON_THUMBNAILS");

    @Override
    public Lesson getLesson(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se ha encontrado la lección con ID: " + id));
    }

    @Override
    public List<Lesson> getLessons() {
        return repository.findAll();
    }

    @Override
    public Lesson createLesson(String lessonName, String lessonDescription) {
        return new Lesson(null, lessonName, lessonDescription, null, null, null);
    }

    @Override
    public Lesson save(Lesson lesson, MultipartFile file, MultipartFile thumbnail) {
        try {
            String videoUrl = uploadLesson(file, lesson.getName());
            String thumbnailUrl = uploadThumbnail(thumbnail, lesson.getName());

            lesson.setVideoUrl(videoUrl);
            lesson.setThumbnailUrl(thumbnailUrl);
            lesson.setUploadDate(LocalDate.now());

            return repository.save(lesson);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar la lección: " + e.getMessage(), e);
        }
    }

    @Override
    public Lesson updateLesson(Long id, String lessonName, String lessonDescription, MultipartFile file) throws IOException {
        Lesson existingLesson = getLesson(id);
        existingLesson.setName(lessonName);
        existingLesson.setDescription(lessonDescription);

        if (file != null && !file.isEmpty()) {
            String videoUrl = uploadLesson(file, lessonName);
            existingLesson.setVideoUrl(videoUrl);
        }

        return repository.save(existingLesson);
    }

    @Override
    public void deleteLesson(Long id) {
        getLesson(id); // Verifica existencia
        repository.deleteById(id);
    }

    private String uploadLesson(MultipartFile file, String lessonName) throws IOException {
        String extension = getExtension(file.getOriginalFilename()).toLowerCase();

        if (!isValidVideoExtension(extension)) {
            throw new RuntimeException("Formato de video no válido: " + extension);
        }

        String fileName = normalizeFileName(lessonName, "video", extension);
        return saveFile(file, DIRECTORY_LESSON_VIDEOS, fileName, "/uploads/lessonVideos/");
    }

    private String uploadThumbnail(MultipartFile file, String lessonName) throws IOException {
        String extension = getExtension(file.getOriginalFilename()).toLowerCase();

        if (!isValidImageExtension(extension)) {
            throw new RuntimeException("Formato de imagen no válido: " + extension);
        }

        String fileName = normalizeFileName(lessonName, "thumbnail", extension);
        return saveFile(file, DIRECTORY_LESSON_THUMBNAILS, fileName, "/uploads/lessonThumbnails/");
    }

    private String saveFile(MultipartFile file, String directoryPath, String fileName, String relativePathPrefix) throws IOException {
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        Path filePath = Paths.get(directory.getAbsolutePath(), fileName);
        Files.write(filePath, file.getBytes());

        return relativePathPrefix + fileName;
    }

    private String normalizeFileName(String baseName, String suffix, String extension) {
        return baseName.replaceAll("\\s+", "_").toLowerCase() + "_" + suffix + extension;
    }

    private String getExtension(String fileName) {
        int index = fileName.lastIndexOf(".");
        return (index != -1) ? fileName.substring(index) : "";
    }

    private boolean isValidVideoExtension(String extension) {
        return extension.matches("\\.(mp4|avi|mov|mkv|webm|flv|wmv)");
    }

    private boolean isValidImageExtension(String extension) {
        return extension.matches("\\.(jpg|jpeg|png|gif|bmp|webp)");
    }
}
