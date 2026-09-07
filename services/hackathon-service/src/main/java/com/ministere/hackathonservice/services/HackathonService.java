package com.ministere.hackathonservice.services;

import com.ministere.hackathonservice.entities.Hackathon;
import com.ministere.hackathonservice.repositories.HackathonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HackathonService {
    @Autowired
    private HackathonRepository repository;

    public Hackathon createHackathon(Hackathon hackathon) {
        if (hackathon.getStatus() == null) hackathon.setStatus("DRAFT");
        return repository.save(hackathon);
    }

    public List<Hackathon> getAllHackathons() {
        return repository.findAll();
    }

    public Hackathon getHackathonById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Hackathon non trouvé"));
    }

    public List<Hackathon> getPublishedHackathons() {
        return repository.findByStatus("PUBLISHED");
    }
}