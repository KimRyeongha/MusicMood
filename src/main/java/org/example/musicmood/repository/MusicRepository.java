package org.example.musicmood.repository;

import org.example.musicmood.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicRepository extends JpaRepository<Music, Long> {
    // 나중에 특정 감성 태그(#새벽, #비오는날)만 검색하고 싶을 때 쓸 마법의 코드!
    List<Music> findByMoodTag(String moodTag);
}