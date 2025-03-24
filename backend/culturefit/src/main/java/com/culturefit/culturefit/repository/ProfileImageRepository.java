package com.culturefit.culturefit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.culturefit.culturefit.domain.ProfileImage;


public interface ProfileImageRepository extends JpaRepository<ProfileImage, Long> {
    ProfileImage findByNombre(String nombre);
}
