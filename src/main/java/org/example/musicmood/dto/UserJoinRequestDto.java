package org.example.musicmood.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserJoinRequestDto {
    private String loginId;
    private String password;
    private String nickname;
}