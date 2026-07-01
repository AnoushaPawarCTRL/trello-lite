package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldRegisterUserSuccessfully() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("username", "integrationuser");
        request.put("email", "integration@test.com");
        request.put("password", "password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldRejectDuplicateEmailRegistration() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("username", "user1");
        request.put("email", "duplicate@test.com");
        request.put("password", "password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        Map<String, String> duplicateRequest = new HashMap<>();
        duplicateRequest.put("username", "user2");
        duplicateRequest.put("email", "duplicate@test.com");
        duplicateRequest.put("password", "password456");

        mockMvc.perform(post("/api/auth/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().is5xxServerError());
    }
}