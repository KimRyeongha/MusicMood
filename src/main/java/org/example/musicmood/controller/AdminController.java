package org.example.musicmood.controller;

import lombok.RequiredArgsConstructor;
import org.example.musicmood.repository.MusicLikeRepository;
import org.example.musicmood.repository.MusicRepository;
import org.example.musicmood.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final MusicRepository musicRepository;
    private final MusicLikeRepository musicLikeRepository;

    @GetMapping("/stats")
    public Map<String, Long> getSystemStats() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.countByLoginIdNot("admin"));
        stats.put("totalMusic", musicRepository.count());
        stats.put("totalLikes", musicLikeRepository.count());

        return stats;
    }
}