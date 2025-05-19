package com.culturefit.culturefit.services.progressPointService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domains.Exercise;
import com.culturefit.culturefit.domains.ProgressPoint;
import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.ProgressPointDto;
import com.culturefit.culturefit.exceptions.exerciseExceptions.NotFoundExerciseException;
import com.culturefit.culturefit.exceptions.progressPointExceptions.ErrorSavingProgressPointException;
import com.culturefit.culturefit.exceptions.progressPointExceptions.NotFoundProgressPointException;
import com.culturefit.culturefit.exceptions.userExceptions.NotFoundUserException;
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

    public List<ProgressPoint> getProgressPointFromUser(Long userId, Long exerciseId) {
        try {
            return progressPointRepository.findByUserIdAndExerciseIdOrderByDateAsc(userId, exerciseId);
        } catch (Exception e) {
            throw new NotFoundProgressPointException();
        }
    }

    public ProgressPoint getProgressPoint(Long id) {
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

    public ProgressPoint updateProgressPoint(ProgressPoint progressPoint) {
        getProgressPoint(progressPoint.getId()); // Para comprobar si existe
        return progressPointRepository.save(progressPoint);
    }

    public ProgressPoint convertToClass(ProgressPointDto dto) {
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new NotFoundUserException());
    
        Exercise exercise = exerciseRepository.findById(dto.getExerciseId())
            .orElseThrow(() -> new NotFoundExerciseException());

        ProgressPoint progressPoint = new ProgressPoint();
        progressPoint.setWeight(dto.getWeight());
        progressPoint.setRepetitions(dto.getRepetitions());
        progressPoint.setDate(dto.getDate());
        progressPoint.setUser(user);
        progressPoint.setExercise(exercise);

        return progressPoint;
    }

    public ProgressPoint getLatestFromUser(Long id, Long exerciseId){
        return progressPointRepository.findFirstByUserIdAndExerciseIdOrderByDateDesc(id, exerciseId)
                .orElseThrow(NotFoundProgressPointException::new);
    }
}
