package com.culturefit.culturefit.services.progressPointService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domains.ProgressPoint;
import com.culturefit.culturefit.exceptions.progressPointExceptions.ErrorSavingProgressPointException;
import com.culturefit.culturefit.exceptions.progressPointExceptions.NotFoundProgressPointException;
import com.culturefit.culturefit.repositories.ExerciseRepository;
import com.culturefit.culturefit.repositories.ProgressPointRepository;
import com.culturefit.culturefit.repositories.UserRepository;

@Service
public class ProgressPointServiceImpl implements ProgressPointService {
    @Autowired
    ProgressPointRepository progressPointRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ExerciseRepository exerciseRepository;

    public ProgressPoint saveProgressPoint(ProgressPoint progressPoint) {
        try {
            return progressPointRepository.save(progressPoint);
        } catch (Exception e) {
            throw new ErrorSavingProgressPointException();
        }
    }

    public List<ProgressPoint> getProgressPointFromUser(Long userId) {
        try{
            return progressPointRepository.findByUserId(userId);
        } catch (Exception e){
            throw new NotFoundProgressPointException();
        }
    }

    public ProgressPoint getProgressPoint(Long id){
        return progressPointRepository.findById(id)
            .orElseThrow(NotFoundProgressPointException::new);
    }

    public boolean deleteProgressPoint(Long id) {
        try {
            progressPointRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new NotFoundProgressPointException();
        }
    }

    public ProgressPoint updateProgressPoint(ProgressPoint progressPoint){
        getProgressPoint(progressPoint.getId()); // Para comprobar si existe
        return progressPointRepository.save(progressPoint);
    }
}
