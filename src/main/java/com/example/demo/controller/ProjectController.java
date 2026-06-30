package com.example.demo.controller;

import com.example.demo.entity.Project;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public ResponseEntity<?> getMyProjects(Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName());
        List<Project> projects = projectService.getProjectsByOwner(owner);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }
}