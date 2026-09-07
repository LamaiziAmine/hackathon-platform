package com.ministere.deliverableservice.repositories;

import com.ministere.deliverableservice.entities.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByTeamId(Long teamId);

    List<Submission> findByRequirementId(Long requirementId);
}