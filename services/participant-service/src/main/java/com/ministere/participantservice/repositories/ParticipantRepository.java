package com.ministere.participantservice.repositories;

import com.ministere.participantservice.entities.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    Optional<Participant> findByUserId(Long userId);
}