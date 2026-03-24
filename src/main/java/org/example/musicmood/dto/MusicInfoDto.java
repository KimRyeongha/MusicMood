package org.example.musicmood.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MusicInfoDto {
    private String videoId;
    private String title;
    private String thumbnailUrl; // 화면에 보여줄 썸네일 이미지 주소
}