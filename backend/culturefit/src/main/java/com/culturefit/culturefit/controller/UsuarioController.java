package com.culturefit.culturefit.controller;

import org.springframework.web.bind.annotation.RestController;

import com.culturefit.culturefit.domain.Usuario;
import com.culturefit.culturefit.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/usuario")
    public ResponseEntity <?> nuevoUsuario(@RequestBody Usuario usuario) {
        Usuario guardado = usuarioService.guardarUsuario(usuario);
        
        return  ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }
    
}
