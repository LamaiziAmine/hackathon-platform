package com.ministere.participantservice.controllers;

import com.ministere.participantservice.entities.Participant;
import com.ministere.participantservice.repositories.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/participants")
public class ParticipantController {

    @Autowired
    private ParticipantRepository repository;

    @PostMapping
    public Participant saveOrUpdate(@RequestBody Participant participant) {
        return repository.save(participant);
    }

    @GetMapping("/user/{userId}")
    public Participant getByUserId(@PathVariable Long userId) {
        return repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profil non trouvé"));
    }
}