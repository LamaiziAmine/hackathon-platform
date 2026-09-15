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


    @GetMapping("/requirements/{id}")
    public org.springframework.http.ResponseEntity<DeliverableRequirement> getRequirementById(@PathVariable Long id) {
        return requirementRepository.findById(id)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }


    @GetMapping("/submissions/team/{teamId}")
    public List<Submission> getSubmissionsByTeam(@PathVariable Long teamId) {
        return submissionRepository.findByTeamId(teamId);
    }

    @GetMapping("/requirements/hackathon/{hackId}")
    public List<DeliverableRequirement> getReqsByHack(@PathVariable Long hackId) {
        return requirementRepository.findByHackathonId(hackId);
    }

    @GetMapping("/submissions/requirement/{reqId}")
    public List<Submission> getSubmissionsByRequirement(@PathVariable Long reqId) {
        return submissionRepository.findByRequirementId(reqId);
    }

    @GetMapping("/download/{fileName:.+}")
    public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> downloadFile(@PathVariable String fileName) {
        try {
            java.nio.file.Path filePath = fileStorageService.getFilePath(fileName);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return org.springframework.http.ResponseEntity.ok()
                        .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return org.springframework.http.ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/requirements/{id}")
    public org.springframework.http.ResponseEntity<?> deleteRequirement(@PathVariable Long id) {
        try {
            requirementRepository.deleteById(id);
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.internalServerError().build();
        }
    }
}