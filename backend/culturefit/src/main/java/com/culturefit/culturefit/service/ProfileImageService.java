package com.culturefit.culturefit.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface ProfileImageService {
    String guardarImagen(Long usuarioId, MultipartFile archivo, String nombreUsuario) throws IOException;
    String obtenerExtension(String nombreArchivo);
}
