package com.ministere.teamservice.controllers;

import com.ministere.teamservice.entities.Team;
import com.ministere.teamservice.entities.TeamMember;
import com.ministere.teamservice.repositories.TeamMemberRepository;
import com.ministere.teamservice.repositories.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teams")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository memberRepository;

    // Récupérer toutes les équipes
    @GetMapping
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    // Créer une équipe
    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamRepository.save(team);
    }

    // Ajouter un membre à une équipe
    @PostMapping("/{teamId}/members/{participantId}")
    public TeamMember addMember(@PathVariable Long teamId, @PathVariable Long participantId) {
        TeamMember member = new TeamMember();
        member.setTeamId(teamId);
        member.setParticipantId(participantId);
        return memberRepository.save(member);
    }

    // Récupérer les équipes d'un hackathon
    @GetMapping("/hackathon/{hackId}")
    public List<Team> getTeamsByHackathon(@PathVariable Long hackId) {
        return teamRepository.findByHackathonId(hackId);
    }

    // Affecter un mentor à une équipe
    @PatchMapping("/{teamId}/assign-mentor/{mentorId}")
    public Team assignMentor(@PathVariable Long teamId, @PathVariable Long mentorId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));

        team.setMentorId(mentorId);
        return teamRepository.save(team);
    }

    // Récupérer les équipes encadrées par un mentor
    @GetMapping("/mentor/{mentorId}")
    public List<Team> getTeamsByMentor(@PathVariable Long mentorId) {
        return teamRepository.findByMentorId(mentorId);
    }

    // Retirer un mentor d'une équipe
    @PatchMapping("/{teamId}/remove-mentor")
    public Team removeMentor(@PathVariable Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));

        team.setMentorId(null);
        return teamRepository.save(team);
    }
}