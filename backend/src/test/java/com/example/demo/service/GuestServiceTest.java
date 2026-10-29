package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.example.demo.entity.User;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;

@SpringBootTest
@ActiveProfiles("test")
class GuestServiceTest {

    @Autowired
    private GuestService guestService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void createGuestSeedsSampleProjects() {
        User guest = guestService.createGuest();

        assertTrue(guest.isGuestAccount());
        assertEquals(2, projectRepository.findByOwner(guest).size());
    }

    @Test
    void expiredGuestsAreDeletedWithTheirData() {
        User oldGuest = guestService.createGuest();
        oldGuest.setCreatedAt(LocalDateTime.now().minusHours(GuestService.GUEST_LIFETIME_HOURS + 1));
        userRepository.save(oldGuest);

        User freshGuest = guestService.createGuest();

        guestService.deleteExpiredGuests();

        assertNull(userRepository.findByUsername(oldGuest.getUsername()));
        assertEquals(0, projectRepository.findByOwner(oldGuest).size());
        assertNotNull(userRepository.findByUsername(freshGuest.getUsername()));
    }
}
