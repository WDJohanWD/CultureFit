package com.culturefit.culturefit.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.culturefit.culturefit.domains.User;


@Repository
public interface UserRepository  extends JpaRepository<User, Long>{
    Optional<User> findById(Long id);
    Optional<User> findByName(String name);
    boolean existsByName(String name);
    boolean existsByEmail(String name);
    Optional<User> findByEmail(String email);
    Optional<User> findByStripeId(String stripeId);

    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<User> searchByName(String search);
}
