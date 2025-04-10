package com.culturefit.culturefit.exceptions;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.culturefit.culturefit.exceptions.paymentExceptions.StripePaymentException;
import com.culturefit.culturefit.exceptions.profileImageExceptions.ErrorSavingImageException;
import com.culturefit.culturefit.exceptions.userExceptions.ErrorSavingUserException;
import com.culturefit.culturefit.exceptions.userExceptions.NotFoundUserException;

import lombok.AllArgsConstructor;
import lombok.Getter;

@RestControllerAdvice
public class GlobalControllerAdvice extends ResponseEntityExceptionHandler {

    // Manejo de excepciones para los usuarios
    @ExceptionHandler(ErrorSavingUserException.class)
    public ResponseEntity<?> handleErrorSavingUserException(ErrorSavingUserException e, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST,
                e.getMessage(),
                request.getDescription(false) // Usamos WebRequest para obtener la URI
        );
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundUserException.class)
    public ResponseEntity<?> handleNotFoundUserException(NotFoundUserException e, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND,
                e.getMessage(),
                request.getDescription(false));
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    // Manejo de excepciones para los ejercicios
    @ExceptionHandler(ErrorSavingUserException.class)
    public ResponseEntity<?> handleErrorSavingExerciseException(ErrorSavingUserException e, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST,
                e.getMessage(),
                request.getDescription(false)
        );
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundUserException.class)
    public ResponseEntity<?> handleNotFoundExerciseException(NotFoundUserException e, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND,
                e.getMessage(),
                request.getDescription(false));
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    //Manejo de excepciones de Stripe
    @ExceptionHandler(StripePaymentException.class)
    public ResponseEntity<ExcepcionBody> handleStripePaymentException(StripePaymentException e, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getMessage(),
                request.getDescription(false));
    
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Manejo de excepciones de subida de archivos
    @ExceptionHandler(ErrorSavingImageException.class)
    public ResponseEntity<ExcepcionBody> handleErrorSavingImageException(ErrorSavingImageException e, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST,
                e.getMessage(),
                request.getDescription(false));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // Método genérico para manejar todas las excepciones no específicas
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception ex, @Nullable Object body, HttpHeaders headers, // (*)
            HttpStatusCode status, WebRequest request) {
        ExcepcionBody myBody = new ExcepcionBody(LocalDateTime.now(),
                status, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return ResponseEntity.status(status).headers(headers).body(myBody);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex, 
        HttpHeaders headers, 
        HttpStatusCode status, 
        WebRequest request) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

}

// Clase para estructurar la respuesta del error
@AllArgsConstructor
@Getter
class ExcepcionBody {
    private LocalDateTime timestamp;
    private HttpStatusCode status;
    private String message;
    private String path;
}
