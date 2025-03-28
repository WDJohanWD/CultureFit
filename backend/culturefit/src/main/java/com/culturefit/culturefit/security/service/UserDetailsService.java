package com.culturefit.culturefit.security.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.culturefit.culturefit.exceptions.userExceptions.NotFoundUserException;

public interface UserDetailsService {
    UserDetails loadUserByEmail(String email) throws NotFoundUserException;
}
