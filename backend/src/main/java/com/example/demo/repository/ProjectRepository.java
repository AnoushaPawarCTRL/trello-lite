package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Project;
import com.example.demo.entity.User;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);

     @Query("SELECT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.id = :id")
     Optional<Project> findByIdWithTasks(@Param("id") Long id);
}