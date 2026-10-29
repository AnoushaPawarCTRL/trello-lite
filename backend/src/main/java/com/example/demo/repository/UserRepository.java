package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUsername(String username);

    List<User> findByGuestTrueAndCreatedAtBefore(LocalDateTime cutoff);

    long countByGuestTrue();

    User findFirstByGuestTrueOrderByCreatedAtAsc();
}