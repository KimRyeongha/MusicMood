import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // 상태 관리
  const [musicList, setMusicList] = useState([]);
  const [videoId, setVideoId] = useState('');
  const [moodTag, setMoodTag] = useState('#코딩할때');
  const [selectedTag, setSelectedTag] = useState('전체');

  // 1. 서버에서 노래 목록 가져오기
  const fetchMusicList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/music/list');
      setMusicList(response.data);
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  };

  // 앱이 처음 켜질 때 목록 한 번 가져오기
  useEffect(() => {
    fetchMusicList();
  }, []);

  // 2. 새로운 노래 저장하기
  const handleSave = async () => {
    if (!videoId) {
      alert('유튜브 ID를 입력해주세요!');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/music/save', {
        videoId: videoId,
        moodTag: moodTag
      });
      alert('저장 성공!');
      setVideoId(''); // 입력창 초기화
      fetchMusicList(); // 저장했으니 목록 다시 불러오기
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>🎵 My Mood, My Music (M3)</h1>

        {/* 입력 섹션 */}
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h3>새로운 음악 추가하기</h3>
          <input
              type="text"
              placeholder="유튜브 ID (예: hvOwe-1D-0Q)"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <select
              value={moodTag}
              onChange={(e) => setMoodTag(e.target.value)}
              style={{ padding: '8px', marginRight: '10px' }}
          >
            {/* 💻 상황 / 일상 */}
            <option value="#코딩할때">#코딩할때</option>
            <option value="#과제폭발_노동요">#과제폭발_노동요</option>
            <option value="#드라이브">#드라이브</option>
            <option value="#출퇴근길">#출퇴근길</option>
            <option value="#운동할때">#운동할때</option>
            {/* ⛅ 날씨 / 시간 */}
            <option value="#화창한날">#화창한날</option>
            <option value="#비오는날">#비오는날</option>
            <option value="#선선한밤">#선선한밤</option>
            <option value="#새벽감성">#새벽감성</option>
            {/* ❤️ 감성 / 기분 */}
            <option value="#몽글몽글">#몽글몽글</option>
            <option value="#신나는날">#신나는날</option>
            <option value="#위로가필요해">#위로가필요해</option>
            <option value="#잔잔한">#잔잔한</option>
            <option value="#둠칫둠칫">#둠칫둠칫</option>
            <option value="#스트레스해소">#스트레스해소</option>
          </select>
          <button onClick={handleSave} style={{ padding: '8px 16px', cursor: 'pointer' }}>저장</button>
        </div>

        {/* 리스트 섹션 헤더 */}
        <h2>🎧 오늘의 추천 플레이리스트</h2>

        {/* 필터 버튼 섹션 */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['전체', '#코딩할때', '#비오는날', '#드라이브', '#새벽감성', '#몽글몽글', '#신나는날'].map(tag => (
              <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: '1px solid #007bff',
                    backgroundColor: selectedTag === tag ? '#007bff' : 'white',
                    color: selectedTag === tag ? 'white' : '#007bff',
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
              >
                {tag}
              </button>
          ))}
        </div>

        {/* 필터링된 리스트 섹션 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {musicList
              .filter(music => selectedTag === '전체' || music.moodTag === selectedTag)
              .map((music) => (
                  <div key={music.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                    <a
                        href={`https://www.youtube.com/watch?v=${music.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      <img
                          src={`https://img.youtube.com/vi/${music.videoId}/mqdefault.jpg`}
                          alt={music.title}
                          style={{ width: '100%', borderRadius: '4px', cursor: 'pointer' }}
                      />
                    </a>
                    <h4 style={{ margin: '10px 0 5px 0' }}>{music.title || '제목 없음'}</h4>
                    <span style={{ color: '#007bff', fontWeight: 'bold' }}>{music.moodTag}</span>
                  </div>
              ))}
          {/* 필터링된 결과가 없을 때 보여줄 문구 */}
          {musicList.filter(music => selectedTag === '전체' || music.moodTag === selectedTag).length === 0 && (
              <p style={{ color: '#888' }}>해당 태그로 등록된 노래가 아직 없어요!</p>
          )}
        </div>
      </div>
  );
}

export default App;