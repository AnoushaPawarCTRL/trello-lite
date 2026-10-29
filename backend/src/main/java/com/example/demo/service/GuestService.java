package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Project;
import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;
import com.example.demo.entity.User;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Temporary guest accounts for people trying the live demo.
 *
 * Each click on "Try as guest" creates a fresh account with sample data,
 * so every visitor gets their own sandbox (ownership checks keep guests apart).
 * Guest accounts older than 24 hours are deleted, along with their projects and tasks.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GuestService {

    static final int GUEST_LIFETIME_HOURS = 24;
    static final int MAX_GUESTS = 200;

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createGuest() {
        // Keep the demo database small: if lots of guests exist, remove the oldest one.
        if (userRepository.countByGuestTrue() >= MAX_GUESTS) {
            User oldest = userRepository.findFirstByGuestTrueOrderByCreatedAtAsc();
            if (oldest != null) {
                deleteGuest(oldest);
            }
        }

        String username;
        do {
            username = "guest_" + UUID.randomUUID().toString().substring(0, 6);
        } while (userRepository.findByUsername(username) != null);

        User guest = new User();
        guest.setUsername(username);
        guest.setEmail(username + "@guest.trellolite.local");
        // Random password nobody knows: guests can only get in through /api/auth/guest
        guest.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        guest.setGuest(true);
        guest.setCreatedAt(LocalDateTime.now());
        guest = userRepository.save(guest);

        seedSampleData(guest);
        return guest;
    }

    // Runs every hour while the server is awake
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void deleteExpiredGuests() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(GUEST_LIFETIME_HOURS);
        List<User> expired = userRepository.findByGuestTrueAndCreatedAtBefore(cutoff);
        expired.forEach(this::deleteGuest);
        if (!expired.isEmpty()) {
            log.info("Deleted {} expired guest account(s)", expired.size());
        }
    }

    // The free host sleeps when idle, so the hourly job may not run for a while.
    // Cleaning up on every start covers that, since a visit wakes the server.
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void cleanUpOnStartup() {
        deleteExpiredGuests();
    }

    private void deleteGuest(User guest) {
        taskRepository.unassignUser(guest);
        projectRepository.deleteAll(projectRepository.findByOwner(guest)); // tasks cascade
        userRepository.delete(guest);
    }

    private void seedSampleData(User owner) {
        LocalDate today = LocalDate.now();

        Project website = project("Website relaunch",
                "Refresh the company site before the spring campaign", owner);
        task(website, "Pick a colour palette", "Two options to show the team", TaskStatus.DONE, null);
        task(website, "Write homepage copy", "Short and punchy, under 150 words", TaskStatus.IN_PROGRESS, today.plusDays(2));
        task(website, "Fix the broken contact form", "Submissions are not reaching the inbox", TaskStatus.TO_DO, today.minusDays(1));
        task(website, "Book a product photographer", null, TaskStatus.TO_DO, today.plusDays(10));

        Project move = project("Moving flat", "Everything for the move at the end of the month", owner);
        task(move, "Give notice to landlord", null, TaskStatus.DONE, null);
        task(move, "Book a van", "Saturday morning if possible", TaskStatus.TO_DO, today.plusDays(5));
        task(move, "Pack the kitchen", null, TaskStatus.TO_DO, null);
    }

    private Project project(String name, String description, User owner) {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setOwner(owner);
        return projectRepository.save(project);
    }

    private void task(Project project, String title, String description, TaskStatus status, LocalDate deadline) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status);
        task.setDeadline(deadline);
        task.setProject(project);
        taskRepository.save(task);
    }
}
