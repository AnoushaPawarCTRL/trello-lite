package com.example.demo.dto;

import java.util.List;

import lombok.Data;

@Data
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String ownerUsername;
    private List<TaskResponse> tasks;
}