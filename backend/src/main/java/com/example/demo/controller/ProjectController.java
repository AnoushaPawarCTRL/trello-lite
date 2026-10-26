package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ProjectResponse;
import com.example.demo.dto.TaskResponse;
import com.example.demo.entity.Project;
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
    public ResponseEntity<?> getProject(@PathVariable Long id, Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName());
        Project project = projectService.getProjectForOwner(id, owner);
        return ResponseEntity.ok(toProjectResponse(project));
        }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id,
            @RequestBody Map<String, String> request, Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName());
        Project project = projectService.updateProject(id,
                request.get("name"), request.get("description"), owner);
        return ResponseEntity.ok(toProjectResponse(project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName());
        projectService.deleteProject(id, owner);
        return ResponseEntity.noContent().build();
    }

    private ProjectResponse toProjectResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setOwnerUsername(project.getOwner().getUsername());
        response.setTasks(
            project.getTasks().stream().map(TaskResponse::from).toList()
        );
        return response;
    }

    
}