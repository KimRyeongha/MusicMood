package org.example.musicmood.controller;

import lombok.RequiredArgsConstructor;
import org.example.musicmood.dto.UserJoinRequestDto;
import org.example.musicmood.dto.UserLoginRequestDto;
import org.example.musicmood.entity.User;
import org.example.musicmood.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 연결 허용!
public class UserController {

    private final UserService userService;

    // 회원가입 API
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody UserJoinRequestDto dto) {
        try {
            User savedUser = userService.join(dto);
            return ResponseEntity.ok(savedUser); // 성공
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 실패 (중복 등)
        }
    }

    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDto dto) {
        try {
            User user = userService.login(dto.getLoginId(), dto.getPassword());
            return ResponseEntity.ok(user); // 성공
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage()); // 실패 (비번 틀림 등)
        }
    }

    // 닉네임 변경 API
    @PutMapping("/update/nickname")
    public ResponseEntity<?> updateNickname(@RequestBody org.example.musicmood.dto.UpdateNicknameRequestDto dto) {
        try {
            User updatedUser = userService.updateNickname(dto.getLoginId(), dto.getNewNickname());
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 비밀번호 변경 API
    @PutMapping("/update/password")
    public ResponseEntity<?> updatePassword(@RequestBody org.example.musicmood.dto.UpdatePasswordRequestDto dto) {
        try {
            User updatedUser = userService.updatePassword(dto.getLoginId(), dto.getCurrentPassword(), dto.getNewPassword());
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}