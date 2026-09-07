package com.ministere.teamservice.controllers;

import com.ministere.teamservice.entities.*;
import com.ministere.teamservice.repositories.*;
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

    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamRepository.save(team);
    }

    @PostMapping("/{teamId}/members/{participantId}")
    public TeamMember addMember(@PathVariable Long teamId, @PathVariable Long participantId) {
        TeamMember member = new TeamMember();
        member.setTeamId(teamId);
        member.setParticipantId(participantId);
        return memberRepository.save(member);
    }

    @PatchMapping("/{teamId}/assign-mentor/{mentorId}")
    public Team assignMentor(@PathVariable Long teamId, @PathVariable Long mentorId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));

        team.setMentorId(mentorId);
        return teamRepository.save(team);
    }

    @GetMapping("/mentor/{mentorId}")
    public List<Team> getTeamsByMentor(@PathVariable Long mentorId) {
        return teamRepository.findByMentorId(mentorId);
    }

    @PatchMapping("/{teamId}/remove-mentor")
    public Team removeMentor(@PathVariable Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));

        team.setMentorId(null);
        return teamRepository.save(team);
    }
}