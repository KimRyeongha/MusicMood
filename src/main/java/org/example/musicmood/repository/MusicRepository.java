package org.example.musicmood.repository;

import org.example.musicmood.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MusicRepository extends JpaRepository<Music, Long> {
    List<Music> findByMoodTag(String moodTag);
    List<Music> findAllByLoginId(String loginId);

    @Modifying
    @Transactional
    @Query("UPDATE Music m SET m.uploader = :newNickname WHERE m.uploader = :oldNickname")
    void updateUploaderNickname(@Param("oldNickname") String oldNickname, @Param("newNickname") String newNickname);
}