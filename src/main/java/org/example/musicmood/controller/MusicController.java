package org.example.musicmood.controller;

import lombok.RequiredArgsConstructor;
import org.example.musicmood.dto.MusicInfoDto;
import org.example.musicmood.dto.MusicSaveRequestDto;
import org.example.musicmood.entity.Music;
import org.example.musicmood.entity.MusicLike;
import org.example.musicmood.repository.MusicLikeRepository;
import org.example.musicmood.repository.MusicRepository;
import org.example.musicmood.service.YouTubeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/music")
@CrossOrigin(origins = "http://localhost:3000")
public class MusicController {

    private final YouTubeService youTubeService;
    private final MusicRepository musicRepository;
    private final MusicLikeRepository musicLikeRepository;

    // 1. 노래 저장
    @PostMapping("/save")
    public String saveMusic(@RequestBody MusicSaveRequestDto request) {
        MusicInfoDto info = youTubeService.getVideoInfo(request.getVideoId());

        Music music = Music.builder()
                .id(null)
                .videoId(request.getVideoId())
                .title(info.getTitle())
                .moodTag(request.getMoodTag())
                .loginId(request.getLoginId())
                .nickname(request.getNickname())
                .build();

        musicRepository.save(music);
        return "저장 성공!";
    }

    // 2. 내가 올린 노래 목록
    @GetMapping("/list")
    public List<Music> getMusicList(@RequestParam("loginId") String loginId) {
        return musicRepository.findAllByLoginId(loginId);
    }

    // 3. 전체 노래 목록
    @GetMapping("/all")
    public List<Music> getAllMusic() {
        return musicRepository.findAll();
    }

    // 4. 좋아요 토글
    @PostMapping("/{musicId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable("musicId") Long musicId, @RequestParam("loginId") String loginId) {
        Optional<MusicLike> existingLike = musicLikeRepository.findByLoginIdAndMusicId(loginId, musicId);

        if (existingLike.isPresent()) {
            musicLikeRepository.delete(existingLike.get());
            return ResponseEntity.ok("좋아요 취소됨");
        } else {
            MusicLike newLike = new MusicLike();
            newLike.setLoginId(loginId);
            newLike.setMusicId(musicId);
            musicLikeRepository.save(newLike);
            return ResponseEntity.ok("좋아요 추가됨");
        }
    }

    // 5. 내가 좋아요 누른 musicId 목록
    @GetMapping("/liked-ids")
    public List<Long> getLikedMusicIds(@RequestParam("loginId") String loginId) {
        return musicLikeRepository.findAllByLoginId(loginId)
                .stream()
                .map(MusicLike::getMusicId)
                .collect(Collectors.toList());
    }

    // 6. 내가 좋아요 누른 노래 데이터
    @GetMapping("/liked-music")
    public List<Music> getLikedMusic(@RequestParam("loginId") String loginId) {
        List<Long> likedMusicIds = musicLikeRepository.findAllByLoginId(loginId)
                .stream()
                .map(MusicLike::getMusicId)
                .collect(Collectors.toList());
        return musicRepository.findAllById(likedMusicIds);
    }
}