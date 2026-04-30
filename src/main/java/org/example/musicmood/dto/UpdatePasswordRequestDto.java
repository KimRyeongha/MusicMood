package org.example.musicmood.dto;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class UpdatePasswordRequestDto {
    private String loginId;
    private String currentPassword; // 현재 비번 확인용!
    private String newPassword;
}