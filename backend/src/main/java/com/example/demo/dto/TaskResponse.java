package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;

import lombok.Data;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDate deadline;
    private Long projectId;
    private String projectName;
    private String assignedUsername;

    public static TaskResponse from(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setDeadline(task.getDeadline());
        response.setProjectId(task.getProject().getId());
        response.setProjectName(task.getProject().getName());
        response.setAssignedUsername(
                task.getAssignedUser() != null ? task.getAssignedUser().getUsername() : null);
        return response;
    }
}