package com.ministere.applicationservice.controllers;

import com.ministere.applicationservice.entities.Application;
import com.ministere.applicationservice.repositories.ApplicationRepository;
import com.ministere.applicationservice.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository repository;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/submit")
    public Application submitApplication(
            @RequestParam("userId") Long userId,
            @RequestParam("hackathonId") Long hackathonId,
            @RequestParam("motivation") String motivation,
            @RequestParam("file") MultipartFile file) throws Exception {

        String filePath = fileStorageService.storeFile(file);

        Application app = new Application();
        app.setUserId(userId);
        app.setHackathonId(hackathonId);
        app.setMotivation(motivation);
        app.setCvFilePath(filePath);
        app.setSubmissionDate(LocalDateTime.now());
        app.setStatus("PENDING");

        return repository.save(app);
    }

    @GetMapping("/user/{userId}")
    public List<Application> getByUser(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }

    @GetMapping("/hackathon/{hackId}")
    public List<Application> getByHackathon(@PathVariable Long hackId) {
        return repository.findByHackathonId(hackId);
    }
}