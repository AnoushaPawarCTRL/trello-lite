package com.example.demo.dto;

import lombok.Data;

@Data
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String ownerUsername;
}