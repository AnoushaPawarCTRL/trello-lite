package com.example.demo.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    // Guest demo accounts are temporary and get deleted by GuestService.
    // Nullable on purpose: existing rows in the live database have no value,
    // and a NOT NULL column could not be added to them. Null means "not a guest".
    @Column
    private Boolean guest;

    @Column
    private LocalDateTime createdAt;

    public boolean isGuestAccount() {
        return Boolean.TRUE.equals(guest);
    }
}