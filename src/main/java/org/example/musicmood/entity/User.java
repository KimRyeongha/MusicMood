package org.example.musicmood.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "USERS") // USER는 DB 예약어일 수 있어서 USERS로 지정!
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String loginId; // 이메일 대신 사용할 로그인 아이디!

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String nickname; // 닉네임도 중복 불가!
}