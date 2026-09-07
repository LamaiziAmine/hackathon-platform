package com.ministere.deliverableservice.controllers;

import com.ministere.deliverableservice.repositories.DeliverableRequirementRepository;
import com.ministere.deliverableservice.repositories.SubmissionRepository;
import com.ministere.deliverableservice.entities.*;
import com.ministere.deliverableservice.repositories.*;
import com.ministere.deliverableservice.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/deliverables")
public class DeliverableController {

    @Autowired
    private DeliverableRequirementRepository requirementRepository;
    @Autowired
    private SubmissionRepository submissionRepository;
    @Autowired
    private FileStorageService fileStorageService;

    
    @PostMapping("/requirements")
    public DeliverableRequirement createRequirement(@RequestBody DeliverableRequirement req) {
        return requirementRepository.save(req);
    }


    @PostMapping("/submit")
    public Submission submit(@RequestParam("requirementId") Long reqId,
                             @RequestParam("teamId") Long teamId,
                             @RequestParam("file") MultipartFile file) throws Exception {



        String path = fileStorageService.storeFile(file);
        Submission sub = new Submission();
        sub.setRequirementId(reqId);
        sub.setTeamId(teamId);
        sub.setFilePath(path);
        sub.setSubmissionDate(LocalDateTime.now());
        return submissionRepository.save(sub);
    }


    @GetMapping("/requirements/hackathon/{hackId}")
    public List<DeliverableRequirement> getReqsByHack(@PathVariable Long hackId) {
        return requirementRepository.findByHackathonId(hackId);
    }
}