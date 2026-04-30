package org.example.musicmood.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MusicSaveRequestDto {
    private String videoId; // 유튜브 URL에서 뽑아낸 ID
    private String moodTag; // 사용자가 선택한 감성 태그
    private String loginId;
    private String nickname;
}