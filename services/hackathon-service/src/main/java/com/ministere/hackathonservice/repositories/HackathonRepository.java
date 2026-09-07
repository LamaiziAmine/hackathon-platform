package com.ministere.hackathonservice.repositories;

import com.ministere.hackathonservice.entities.Hackathon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HackathonRepository extends JpaRepository<Hackathon, Long> {
    List<Hackathon> findByStatus(String status);
}