package com.culturefit.culturefit.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.culturefit.culturefit.domains.ProgressPoint;
import com.culturefit.culturefit.dto.ProgressPointDto;
import com.culturefit.culturefit.services.progressPointService.ProgressPointService;

import jakarta.validation.Valid;

@RestController
@Validated
public class ProgressPointController {
    @Autowired
    ProgressPointService progressPointService;

    // Getters

        // Recibir un punto de progrsion por su id
    @GetMapping ("/progress-point/{id}")
    public ResponseEntity<ProgressPoint> getProgressPoint(@PathVariable Long id){
        ProgressPoint progressPoint = progressPointService.getProgressPoint(id);
        return ResponseEntity.ok(progressPoint);
    }

        // Recibir la lista de puntos de progresion de un usuario(userId) en un ejercicio en concreto(exerciseId)
    @GetMapping ("/user-progress/{userId}/{exerciseId}")
    public List<ProgressPoint> getUserProgress(@PathVariable Long userId, @PathVariable Long exerciseId){
        List<ProgressPoint> progressPoints = progressPointService.getProgressPointFromUser(userId, exerciseId);
        return progressPoints;
    }

        // Recibir el último punto de progresion de un usuario(userId) en un ejercicio en concreto(exerciseId)
    @GetMapping ("/user-latest/{userId}/{exerciseId}")
    public ResponseEntity<ProgressPoint> getUserLatest(@PathVariable Long userId, @PathVariable Long exerciseId){
        ProgressPoint progressPoint = progressPointService.getLatestFromUser(userId, exerciseId);
        return ResponseEntity.ok(progressPoint);
    }


    // Posts
    @PostMapping("/new-progress-point")
    public ProgressPoint newProgressPoint (@Valid @RequestBody ProgressPointDto progressPointDto) {
        ProgressPoint progressPoint = progressPointService.convertToClass(progressPointDto);
        ProgressPoint savedProgressPoint = progressPointService.saveProgressPoint(progressPoint);
        return savedProgressPoint;
    }

    //Delete
    @DeleteMapping ("/delete-progress-popint/{id}")
    public void deleteProgressPoint(Long id) {
        progressPointService.deleteProgressPoint(id);
    }

    // Put
    @PutMapping("/edit-progress-point/{id}")
    public ResponseEntity<ProgressPoint> editProgressPoint(@PathVariable Long id, @Valid @RequestBody ProgressPointDto progressPointDto) {
        ProgressPoint progressPoint = progressPointService.convertToClass(progressPointDto);
        progressPoint.setId(id);
        ProgressPoint updatedProgressPoint = progressPointService.updateProgressPoint(progressPoint);
        return ResponseEntity.ok(updatedProgressPoint);
    }
}
