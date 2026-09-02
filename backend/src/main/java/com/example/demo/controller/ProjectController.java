package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ProjectResponse;
import com.example.demo.dto.TaskResponse;
import com.example.demo.entity.Project;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Map<String, String> request, Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName());
        Project project = projectService.createProject(
                request.get("name"),
                request.get("description"),
                owner
        );
        return ResponseEntity.ok(toProjectResponse(project));
    }

    @GetMapping
    public ResponseEntity<?> getMyProjects(Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName());
        List<Project> projects = projectService.getProjectsByOwner(owner);
        List<ProjectResponse> response = projects.stream()
                .map(this::toProjectResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(toProjectResponse(project));
    }

    private ProjectResponse toProjectResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setOwnerUsername(project.getOwner().getUsername());
        response.setTasks(
            project.getTasks().stream().map(this::toTaskResponse).toList()
        );
        return response;
    }

    private TaskResponse toTaskResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setProjectId(task.getProject().getId());
        response.setAssignedUsername(
            task.getAssignedUser() != null ? task.getAssignedUser().getUsername() : null
        );
        return response;
    }
}