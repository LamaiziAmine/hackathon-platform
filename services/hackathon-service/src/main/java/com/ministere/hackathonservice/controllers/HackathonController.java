package com.ministere.hackathonservice.controllers;

import com.ministere.hackathonservice.entities.Hackathon;
import com.ministere.hackathonservice.services.HackathonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/hackathons")
public class HackathonController {

    @Autowired
    private HackathonService service;

    @PostMapping
    public Hackathon create(@RequestBody Hackathon hackathon) {
        return service.createHackathon(hackathon);
    }

    @GetMapping
    public List<Hackathon> getAll() {
        return service.getAllHackathons();
    }

    @GetMapping("/published")
    public List<Hackathon> getPublished() {
        return service.getPublishedHackathons();
    }

    @GetMapping("/{id}")
    public Hackathon getById(@PathVariable Long id) {
        return service.getHackathonById(id);
    }
}