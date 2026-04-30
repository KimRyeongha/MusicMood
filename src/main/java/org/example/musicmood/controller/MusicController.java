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

    // 🌟 좋아요 DB 접근용 Repository 주입!
    private final MusicLikeRepository musicLikeRepository;

    // 1. 노래 저장하기 (POST)
    @PostMapping("/save")
    public String saveMusic(@RequestBody MusicSaveRequestDto request) {
        // 1) 유튜브 API로 제목이랑 썸네일 가져오기
        MusicInfoDto info = youTubeService.getVideoInfo(request.getVideoId());

        // 2) DB에 저장할 엔티티 만들기
        Music music = Music.builder()
                .id(null)
                .videoId(request.getVideoId())
                .title(info.getTitle())
                .moodTag(request.getMoodTag())
                .loginId(request.getLoginId()) // 프론트에서 보낸 주인(loginId) 저장!
                .nickname(request.getNickname())
                .build();

        // 3) DB에 쏙!
        musicRepository.save(music);
        return "저장 성공!";
    }

    // 2. 로그인한 유저의 노래 목록만 불러오기 (GET)
    @GetMapping("/list")
    public List<Music> getMusicList(@RequestParam String loginId) {
        return musicRepository.findAllByLoginId(loginId);
    }

    // 3. DB에 있는 "모든" 노래를 다 가져오기 (홈 화면용)
    @GetMapping("/all")
    public List<Music> getAllMusic() {
        return musicRepository.findAll();
    }

    // ==========================================
    // 🌟 여기서부터 새로 추가된 좋아요(하트) API 3개!
    // ==========================================

    // 4. 좋아요 누르기 & 취소하기 (토글 기능)
    @PostMapping("/{musicId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long musicId, @RequestParam String loginId) {
        Optional<MusicLike> existingLike = musicLikeRepository.findByLoginIdAndMusicId(loginId, musicId);

        if (existingLike.isPresent()) {
            // 이미 좋아요를 눌렀던 상태면 -> 취소! (DB에서 삭제)
            musicLikeRepository.delete(existingLike.get());
            return ResponseEntity.ok("좋아요 취소됨");
        } else {
            // 안 눌렀던 상태면 -> 추가! (DB에 저장)
            MusicLike newLike = new MusicLike();
            newLike.setLoginId(loginId);
            newLike.setMusicId(musicId);
            musicLikeRepository.save(newLike);
            return ResponseEntity.ok("좋아요 추가됨");
        }
    }

    // 5. 홈 화면용: "내가 하트 칠한 노래 번호들만 다 가져와!" (빨간 하트 칠하기 용도)
    @GetMapping("/liked-ids")
    public List<Long> getLikedMusicIds(@RequestParam String loginId) {
        return musicLikeRepository.findAllByLoginId(loginId)
                .stream()
                .map(MusicLike::getMusicId)
                .collect(Collectors.toList());
    }

    // 6. 마이페이지용: "내가 하트 친 진짜 노래 데이터들을 다 가져와!"
    @GetMapping("/liked-music")
    public List<Music> getLikedMusic(@RequestParam String loginId) {
        List<Long> likedMusicIds = musicLikeRepository.findAllByLoginId(loginId)
                .stream()
                .map(MusicLike::getMusicId)
                .collect(Collectors.toList());

        // 번호들로 진짜 노래 데이터들을 한방에 DB에서 뽑아옵니다
        return musicRepository.findAllById(likedMusicIds);
    }
}