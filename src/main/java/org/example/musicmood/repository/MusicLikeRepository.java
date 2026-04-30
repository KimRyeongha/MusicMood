package org.example.musicmood.repository;

import org.example.musicmood.entity.MusicLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MusicLikeRepository extends JpaRepository<MusicLike, Long> {
    // 1. 특정 유저가 특정 노래에 좋아요를 눌렀는지 확인용
    Optional<MusicLike> findByLoginIdAndMusicId(String loginId, Long musicId);

    // 2. 특정 유저가 좋아요 누른 모든 기록 가져오기
    List<MusicLike> findAllByLoginId(String loginId);
}