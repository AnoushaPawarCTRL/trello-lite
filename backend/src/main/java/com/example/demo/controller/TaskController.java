package com.example.demo.controller;

import java.time.LocalDate;
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

import com.example.demo.dto.TaskResponse;
import com.example.demo.entity.Project;
import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ProjectService;
import com.example.demo.service.TaskService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final ProjectService projectService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody Map<String, String> request,
            Authentication authentication) {
        User currentUser = currentUser(authentication);
        Project project = projectService.getProjectForOwner(
                Long.parseLong(request.get("projectId")), currentUser);
        User assignedUser = request.get("assignedUserId") != null
                ? userRepository.findById(Long.parseLong(request.get("assignedUserId"))).orElse(null)
                : null;

        Task task = taskService.createTask(
                request.get("title"),
                request.get("description"),
                project,
                assignedUser,
                parseDeadline(request.get("deadline")));
        return ResponseEntity.ok(TaskResponse.from(task));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long id,
            @RequestBody Map<String, String> request, Authentication authentication) {
        taskService.getTaskForOwner(id, currentUser(authentication));
        TaskStatus status = TaskStatus.valueOf(request.get("status"));
        Task task = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(TaskResponse.from(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
            @RequestBody Map<String, String> request, Authentication authentication) {
        taskService.getTaskForOwner(id, currentUser(authentication));
        Task task = taskService.updateTask(id, request.get("title"), request.get("description"),
                parseDeadline(request.get("deadline")));
        return ResponseEntity.ok(TaskResponse.from(task));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(@PathVariable Long projectId,
            Authentication authentication) {
        Project project = projectService.getProjectForOwner(projectId, currentUser(authentication));
        List<TaskResponse> tasks = taskService.getTasksByProject(project).stream()
                .map(TaskResponse::from)
                .toList();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<TaskResponse>> getUpcomingTasks(Authentication authentication) {
        List<TaskResponse> tasks = taskService.getUpcomingTasks(currentUser(authentication)).stream()
                .map(TaskResponse::from)
                .toList();
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        taskService.getTaskForOwner(id, currentUser(authentication));
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    private User currentUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName());
    }

    private LocalDate parseDeadline(String deadline) {
        return deadline != null && !deadline.isBlank() ? LocalDate.parse(deadline) : null;
    }
}