package org.example.musicmood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users") // H2에서 'USER'는 예약어라 오류가 날 수 있어서 'users'로 이름 변경
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String nickname;
    private String password;
}