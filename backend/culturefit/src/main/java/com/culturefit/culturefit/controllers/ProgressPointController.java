package com.culturefit.culturefit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.culturefit.culturefit.domains.ProgressPoint;
import com.culturefit.culturefit.services.progressPointService.ProgressPointService;

import jakarta.validation.Valid;

@RestController
@Validated
public class ProgressPointController {
    @Autowired
    ProgressPointService progressPointService;

    // Getters
    @GetMapping ("/progress-point/{id}")
    public ResponseEntity<ProgressPoint> getProgressPoint(@PathVariable Long id){
        ProgressPoint progressPoint = progressPointService.getProgressPoint(id);
        return ResponseEntity.ok(progressPoint);
    }

    // Posts
    @PostMapping("/new-progress-point")
    public ProgressPoint newProgressPoint (@Valid @RequestBody ProgressPoint progressPoint) {
        ProgressPoint savedProgressPoint = progressPointService.saveProgressPoint(progressPoint);
        return savedProgressPoint;
    }
}
