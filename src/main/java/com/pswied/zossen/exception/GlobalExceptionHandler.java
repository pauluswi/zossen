package com.pswied.zossen.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

/**
 * Catches specific exceptions thrown by the application and converts them
 * into appropriate HTTP responses.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles the SecurityException thrown by the Z-Trust gateway.
     * When this exception is caught, it returns a clear HTTP 403 Forbidden response.
     *
     * @param ex The caught SecurityException.
     * @return A ResponseEntity with a 403 status and an error message.
     */
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, String>> handleSecurityException(SecurityException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access Denied", "message", ex.getMessage()));
    }

    /**
     * Handles IllegalArgumentException, typically from business validation.
     *
     * @param ex The caught IllegalArgumentException.
     * @return A ResponseEntity with a 400 status and an error message.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Bad Request", "message", ex.getMessage()));
    }
}
