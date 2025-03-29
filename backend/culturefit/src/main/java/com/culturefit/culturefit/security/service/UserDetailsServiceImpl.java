package com.culturefit.culturefit.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.exceptions.userExceptions.NotFoundUserException;
import com.culturefit.culturefit.repositories.UserRepository;
import com.culturefit.culturefit.security.domain.UserDetailsImpl;

import jakarta.transaction.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public UserDetails loadUserByUsername(String name) throws NotFoundUserException {
        User user = userRepository.findByName(name).orElseThrow(NotFoundUserException::new);
        return UserDetailsImpl.build(user);
    }
}
