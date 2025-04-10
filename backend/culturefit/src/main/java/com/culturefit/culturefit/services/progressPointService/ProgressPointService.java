package com.culturefit.culturefit.services.progressPointService;

import java.util.List;

import com.culturefit.culturefit.domains.ProgressPoint;

public interface ProgressPointService {
    ProgressPoint saveProgressPoint(ProgressPoint progressPoint);
    List<ProgressPoint> getProgressPointFromUser(Long userId);
    ProgressPoint getProgressPoint(Long id);
    boolean deleteProgressPoint(Long id);
    ProgressPoint updateProgressPoint(ProgressPoint progressPoint);
}

