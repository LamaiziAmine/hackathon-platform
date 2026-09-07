package com.ministere.applicationservice.repositories;

import com.ministere.applicationservice.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUserId(Long userId);

    List<Application> findByHackathonId(Long hackathonId);

    List<Application> findByStatus(String status);
}