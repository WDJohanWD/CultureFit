package com.culturefit.culturefit.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.culturefit.culturefit.domains.User;

@Repository
public interface UserRepository  extends JpaRepository<User, Long>{
    Optional<User> findById(Long id);
}
