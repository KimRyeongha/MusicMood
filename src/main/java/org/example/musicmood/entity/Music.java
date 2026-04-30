package org.example.musicmood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Music {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String videoId; // 유튜브 영상 고유 ID (예: dQw4w9WgXcQ)
    private String title;   // 유튜브 영상 제목
    private String moodTag; // 감성 태그 (예: #새벽, #비오는날)
    private String loginId;
    private String nickname;

    // 어떤 유저가 이 노래를 추천했는지 연결 (다대일 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}