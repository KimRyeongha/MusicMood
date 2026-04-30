package org.example.musicmood.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class MusicLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String loginId; // 좋아요 누른 사람의 아이디
    private Long musicId;   // 좋아요 눌린 노래의 고유번호(ID)
}