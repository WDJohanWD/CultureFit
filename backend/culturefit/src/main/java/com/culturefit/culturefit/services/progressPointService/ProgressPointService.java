package com.culturefit.culturefit.services.progressPointService;

import java.util.List;

import com.culturefit.culturefit.domains.ProgressPoint;
import com.culturefit.culturefit.dto.ProgressPointDto;

public interface ProgressPointService {
    ProgressPoint saveProgressPoint(ProgressPoint progressPoint);
    List<ProgressPoint> getProgressPointFromUser(Long userId, Long exerciseId);
    ProgressPoint getProgressPoint(Long id);
    boolean deleteProgressPoint(Long id);
    ProgressPoint updateProgressPoint(ProgressPoint progressPoint);
    ProgressPoint convertToClass(ProgressPointDto dto);
    ProgressPoint getLatestFromUser(Long id, Long exerciseId);
}

