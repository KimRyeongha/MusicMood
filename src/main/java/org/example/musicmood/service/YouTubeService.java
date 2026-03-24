package org.example.musicmood.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.musicmood.dto.MusicInfoDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class YouTubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 유튜브 URL에서 영상 정보 가져오기
    public MusicInfoDto getVideoInfo(String videoId) {
        // 구글 유튜브 API 주소
        String apiUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + apiKey;

        try {
            // API 호출해서 결과(JSON) 받아오기
            String response = restTemplate.getForObject(apiUrl, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode items = root.path("items");

            // ✨ 안전 장치: 유튜브가 정상적인 데이터를 안 줬을 때 찐 에러 확인하기!
            if (items.isMissingNode() || items.isEmpty()) {
                System.out.println("🚨 유튜브 API 에러 응답: " + response); // 인텔리제이 콘솔에 진짜 이유 출력
                throw new RuntimeException("유튜브에서 영상을 찾을 수 없거나 API 설정 문제입니다.");
            }

            JsonNode snippet = items.get(0).path("snippet");

            // 제목이랑 썸네일 쏙쏙 뽑아내기
            String title = snippet.path("title").asText();
            String thumbnailUrl = snippet.path("thumbnails").path("high").path("url").asText();

            return MusicInfoDto.builder()
                    .videoId(videoId)
                    .title(title)
                    .thumbnailUrl(thumbnailUrl)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("유튜브 영상 정보를 가져오는데 실패했습니다.", e);
        }
    }
}