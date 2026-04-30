package org.example.musicmood.service;

import lombok.RequiredArgsConstructor;
import org.example.musicmood.dto.UserJoinRequestDto;
import org.example.musicmood.entity.User;
import org.example.musicmood.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 1. 회원가입
    public User join(UserJoinRequestDto dto) {
        // 아이디 중복 검사 (admin 포함 누구든 중복이면 차단)
        if (userRepository.existsByLoginId(dto.getLoginId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }
        // 닉네임 중복 검사
        if (userRepository.existsByNickname(dto.getNickname())) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        User user = new User();
        user.setLoginId(dto.getLoginId());
        user.setPassword(dto.getPassword());
        user.setNickname(dto.getNickname());

        return userRepository.save(user);
    }

    // 2. 로그인
    public User login(String loginId, String password) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        return user;
    }

    // 3-1. 닉네임 변경
    public User updateNickname(String loginId, String newNickname) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 유저입니다."));
        if (!user.getNickname().equals(newNickname) && userRepository.existsByNickname(newNickname)) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }
        user.setNickname(newNickname);
        return userRepository.save(user);
    }

    // 3-2. 비밀번호 변경
    public User updatePassword(String loginId, String currentPassword, String newPassword) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 유저입니다."));
        if (!user.getPassword().equals(currentPassword)) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }
        user.setPassword(newPassword);
        return userRepository.save(user);
    }
}