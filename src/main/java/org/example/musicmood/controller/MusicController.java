package org.example.musicmood.controller;

import lombok.RequiredArgsConstructor;
import org.example.musicmood.dto.MusicInfoDto;
import org.example.musicmood.dto.MusicSaveRequestDto;
import org.example.musicmood.entity.Music;
import org.example.musicmood.repository.MusicRepository;
import org.example.musicmood.service.YouTubeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/music")
@CrossOrigin(origins = "http://localhost:3000") // 리액트(포트 3000)에서 백엔드로 데이터 보낼 때 에러 안 나게 허락해주는 설정!
public class MusicController {

    private final YouTubeService youTubeService;
    private final MusicRepository musicRepository;

    // 1. 노래 저장하기 (POST) - 수정됨!
    @PostMapping("/save")
    public String saveMusic(@RequestBody MusicSaveRequestDto request) {
        // 1) 유튜브 API로 제목이랑 썸네일 가져오기
        MusicInfoDto info = youTubeService.getVideoInfo(request.getVideoId());

        // 2) DB에 저장할 엔티티 만들기
        Music music = Music.builder()
                .id(null) // ✅ [핵심 추가!] ID를 null로 명시해서 JPA가 무조건 '새로 추가'하게 만듭니다.
                .videoId(request.getVideoId())
                .title(info.getTitle())
                .moodTag(request.getMoodTag())
                .build();

        // 3) DB에 쏙! (이제 매번 새로운 ID로 추가됩니다!)
        musicRepository.save(music);
        return "저장 성공!";
    }

    // 2. 전체 노래 목록 불러오기 (GET)
    @GetMapping("/list")
    public List<Music> getAllMusic() {
        return musicRepository.findAll();
    }
}