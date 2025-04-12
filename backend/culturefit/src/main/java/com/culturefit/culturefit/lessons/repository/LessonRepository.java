package com.culturefit.culturefit.lessons.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.culturefit.culturefit.lessons.domain.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
