package com.example.demo.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;
import com.example.demo.repository.TaskRepository;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldUpdateTaskStatusSuccessfully() {
        Task existingTask = new Task();
        existingTask.setId(1L);
        existingTask.setStatus(TaskStatus.TO_DO);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task result = taskService.updateTaskStatus(1L, TaskStatus.IN_PROGRESS);

        assertEquals(TaskStatus.IN_PROGRESS, result.getStatus());
        verify(taskRepository, times(1)).save(existingTask);
    }

    @Test
    void shouldThrowErrorWhenTaskNotFound() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> taskService.updateTaskStatus(99L, TaskStatus.DONE));
        verify(taskRepository, never()).save(any(Task.class));
    }
}