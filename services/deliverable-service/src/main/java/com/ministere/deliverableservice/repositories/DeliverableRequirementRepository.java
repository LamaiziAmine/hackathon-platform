package com.ministere.deliverableservice.repositories;

import com.ministere.deliverableservice.entities.DeliverableRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeliverableRequirementRepository extends JpaRepository<DeliverableRequirement, Long> {
    List<DeliverableRequirement> findByHackathonId(Long hackathonId);
}