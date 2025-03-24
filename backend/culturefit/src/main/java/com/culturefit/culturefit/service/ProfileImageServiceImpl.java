package com.culturefit.culturefit.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domain.ProfileImage;
import com.culturefit.culturefit.repository.ProfileImageRepository;

@Service
public class ProfileImageServiceImpl implements ProfileImageService {
    @Autowired
    private ProfileImageRepository repository;

    public ProfileImage guardarImagen(MultipartFile archivo) throws IOException {
        ProfileImage imagen = new ProfileImage();
        imagen.setNombre(archivo.getOriginalFilename());
        imagen.setTipo(archivo.getContentType());
        imagen.setDatos(archivo.getBytes());

        return repository.save(imagen);
    }

    public ProfileImage obtenerImagen(String nombre) {
        return repository.findByNombre(nombre).orElse(null);
    }
}