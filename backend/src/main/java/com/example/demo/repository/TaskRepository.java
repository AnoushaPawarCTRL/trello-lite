package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Project;
import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;
import com.example.demo.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProject(Project project);

    List<Task> findByProjectOwnerAndDeadlineLessThanEqualAndStatusNotOrderByDeadlineAsc(
            User owner, LocalDate date, TaskStatus status);

    @Modifying
    @Query("UPDATE Task t SET t.assignedUser = null WHERE t.assignedUser = :user")
    void unassignUser(@Param("user") User user);
}
