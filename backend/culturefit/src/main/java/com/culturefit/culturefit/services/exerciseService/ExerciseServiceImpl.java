package com.culturefit.culturefit.services.exerciseService;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.Exercise;
import com.culturefit.culturefit.exceptions.exerciseExceptions.ErrorSavingExerciseException;
import com.culturefit.culturefit.exceptions.exerciseExceptions.NotFoundExerciseException;
import com.culturefit.culturefit.exceptions.profileImageExceptions.ErrorSavingImageException;
import com.culturefit.culturefit.repositories.ExerciseRepository;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class ExerciseServiceImpl implements ExerciseService {

    Dotenv dotenv = Dotenv.load();
    String DIRECTORY_EXERCISE_IMAGES = dotenv.get("DIRECTORY_EXERCISE_IMAGES");

    @Autowired
    ExerciseRepository exerciseRepository;

    public Exercise saveExercise(Exercise exercise) {
        try {
            return exerciseRepository.save(exercise);
        } catch (Exception e) {
            throw new ErrorSavingExerciseException();
        }
    }

    public List<Exercise> getExercise() {
        try{
            return exerciseRepository.findAllByOrderByIdAsc();
        } catch (Exception e){
            throw new NotFoundExerciseException();
        }
    }

    public Exercise getExercise(Long id){
        return exerciseRepository.findById(id)
            .orElseThrow(NotFoundExerciseException::new);
    }

    public boolean deleteExercise(Long id) {
        try {
            exerciseRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new NotFoundExerciseException();
        }
    }

    public Exercise updateExercise(Long id, Exercise exercise) {
        if (exercise.getId() != null && !exercise.getId().equals(id)) {
            throw new IllegalArgumentException("Exercise ID in the path and body do not match.");
        }
        if (!exerciseRepository.existsById(id)) {
            throw new NotFoundExerciseException();
        }
        exercise.setId(id);
        return exerciseRepository.save(exercise);
    }

    public Exercise saveImage(MultipartFile file,Long exerciseId) throws RuntimeException {
        Exercise exercise = exerciseRepository.findById(exerciseId).orElseThrow(NotFoundExerciseException::new);

        try {
            File directory = new File(DIRECTORY_EXERCISE_IMAGES);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Obtener y validar la extensión
            String extension = getExtension(file.getOriginalFilename()).toLowerCase();
            if (!extension.matches("\\.(jpg|jpeg|png|gif|webp)$")) {
                throw new RuntimeException();
            }

            // Nombrar el archivo
            String fileName = exerciseId + "_exercise" + extension;

            // Construcción correcta de la ruta
            Path filePath = Paths.get(directory.getAbsolutePath(), fileName);

            // Guardar el archivo
            Files.write(filePath, file.getBytes());

            // Devolver la URL de acceso
            String url = "/uploads/exerciseImages/" + fileName;

            exercise.setImageUrl(url);
            return exerciseRepository.save(exercise);
            
        } catch (Exception e) {
            throw new ErrorSavingImageException();
        }
    }

    public String getExtension(String fileName) {
        int extensionIndex = fileName.lastIndexOf(".");
        if (extensionIndex == -1) {
            return ""; // Si no tiene extensión, devolver una cadena vacía
        }
        return fileName.substring(extensionIndex);
    }


}
