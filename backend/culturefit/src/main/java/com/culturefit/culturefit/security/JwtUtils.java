package com.culturefit.culturefit.security;

import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.culturefit.culturefit.security.domain.UserDetailsImpl;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration}")
  private int jwtExpirationMs;

  // Genera un token JWT a partir de la autenticación del usuario
  public String generateJwtToken(Authentication authentication) {

    UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

    return Jwts.builder()
        .setSubject((userPrincipal.getId().toString()))
        .setIssuedAt(new Date())
        .claim("role",userPrincipal.getAuthorities().toArray()[0].toString())
        .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
        .signWith(key(), SignatureAlgorithm.HS256)
        .compact();
  }

  // Genera la clave de firma del token a partir de la clave secreta
  private Key key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  // Extrae el nombre de usuario desde un token JWT.
  public String getUserNameFromJwtToken(String token) {
    return Jwts.parserBuilder().setSigningKey(key()).build()
        .parseClaimsJws(token).getBody().getSubject();
  }

  // Valida un token JWT verificando su estructura y firma
  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
      return true;
    } catch (MalformedJwtException e) {
      logger.error("Token JWT inválido: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("Token JWT caducado: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("Token JWT no soportado: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT indica que la string está vacía: {}", e.getMessage());
    }
    return false;
  }
}



