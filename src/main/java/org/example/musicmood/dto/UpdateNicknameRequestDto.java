package org.example.musicmood.dto;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class UpdateNicknameRequestDto {
    private String loginId;
    private String newNickname;
}