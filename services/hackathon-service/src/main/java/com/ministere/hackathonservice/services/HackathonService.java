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

    public Hackathon updateHackathon(Long id, Hackathon updatedHackathon) {
        Hackathon existing = getHackathonById(id);
        existing.setTitle(updatedHackathon.getTitle());
        existing.setDescription(updatedHackathon.getDescription());
        existing.setTheme(updatedHackathon.getTheme());
        existing.setStartDate(updatedHackathon.getStartDate());
        existing.setEndDate(updatedHackathon.getEndDate());
        existing.setLocation(updatedHackathon.getLocation());
        existing.setStatus(updatedHackathon.getStatus());
        return repository.save(existing);
    }

    public void deleteHackathon(Long id) {
        repository.deleteById(id);
    }
}