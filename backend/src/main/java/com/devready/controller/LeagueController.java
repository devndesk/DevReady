package com.devready.controller;

import com.devready.entity.User;
import com.devready.service.LeagueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/league")
public class LeagueController {

    @Autowired
    private LeagueService leagueService;

    @GetMapping("/leaderboard")
    public List<User> getLeaderboard(@RequestParam String leagueGroupId) {
        return leagueService.getLeaderboard(leagueGroupId);
    }
}
