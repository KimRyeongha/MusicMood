package org.example.musicmood.repository;

import org.example.musicmood.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 1. 로그인할 때 아이디로 유저 찾기
    Optional<User> findByLoginId(String loginId);

    // 2. 가입할 때 아이디 중복 검사
    boolean existsByLoginId(String loginId);

    // 3. 가입할 때 닉네임 중복 검사
    boolean existsByNickname(String nickname);

    long countByLoginIdNot(String loginId);
}