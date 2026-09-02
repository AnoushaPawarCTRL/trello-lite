package com.example.demo.dto;

import com.example.demo.entity.TaskStatus;

import lombok.Data;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Long projectId;
    private String assignedUsername;
}