// TaskService.java
package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Project;
import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;
import com.example.demo.entity.User;
import com.example.demo.repository.TaskRepository;
import com.example.demo.exception.TaskNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Task createTask(String title, String description, Project project, User assignedUser, LocalDate deadline) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setProject(project);
        task.setAssignedUser(assignedUser);
        task.setStatus(TaskStatus.TO_DO);
        task.setDeadline(deadline);
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, String title, String description, LocalDate deadline) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (title != null) {
            task.setTitle(title);
        }
        if (description != null) {
            task.setDescription(description);
        }
        task.setDeadline(deadline);
        return taskRepository.save(task);
    }

    public List<Task> getTasksByProject(Project project) {
        return taskRepository.findByProject(project);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public Task getTaskForOwner(Long taskId, User owner) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + taskId));
        if (!task.getProject().getOwner().getId().equals(owner.getId())) {
            throw new TaskNotFoundException("Task not found with id: " + taskId);
        }
        return task;
    }

    public List<Task> getUpcomingTasks(User owner) {
        return taskRepository.findByProjectOwnerAndDeadlineLessThanEqualAndStatusNotOrderByDeadlineAsc(
                owner, LocalDate.now().plusDays(7), TaskStatus.DONE);
    }
}