package com.ministere.teamservice.repositories;

import com.ministere.teamservice.entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByHackathonId(Long hackathonId);

    List<Team> findByMentorId(Long mentorId);
}