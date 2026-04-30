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
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    // 통계를 내려면 3개의 DB 수색대가 모두 필요합니다!
    private final UserRepository userRepository;
    private final MusicRepository musicRepository;
    private final MusicLikeRepository musicLikeRepository;

    @GetMapping("/stats")
    public Map<String, Long> getSystemStats() {
        Map<String, Long> stats = new HashMap<>();

        // JpaRepository에 기본 탑재된 count() 메서드로 전체 개수를 셉니다.
        stats.put("totalUsers", userRepository.countByLoginIdNot("admin"));
        stats.put("totalMusic", musicRepository.count());
        stats.put("totalLikes", musicLikeRepository.count());

        return stats; // JSON 형태로 프론트엔드에 발사!
    }
}