package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Project;
import com.example.demo.entity.User;
import com.example.demo.exception.ProjectNotFoundException;
import com.example.demo.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project createProject(String name, String description, User owner) {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setOwner(owner);
        return projectRepository.save(project);
    }

    public List<Project> getProjectsByOwner(User owner) {
        return projectRepository.findByOwner(owner);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findByIdWithTasks(id)
            .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + id));
    }
}