import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [musicList, setMusicList] = useState([]);
    const [videoId, setVideoId] = useState('');
    const [moodTag, setMoodTag] = useState('#코딩할때');
    const [selectedTag, setSelectedTag] = useState('전체');

    const [isCustomTag, setIsCustomTag] = useState(false);
    const [customTagInput, setCustomTagInput] = useState('');

    const [likedMusicIds, setLikedMusicIds] = useState([]);

    const fetchAllMusic = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/music/all');
            setMusicList(response.data);
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        }
    };

    const fetchLikedMusicIds = async (loginId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/music/liked-ids?loginId=${loginId}`);
            setLikedMusicIds(response.data.map(id => Number(id))); // ✅ 명시적으로 Number 변환
        } catch (error) {
            console.error('좋아요 목록 가져오기 실패:', error);
        }
    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            alert('로그인이 필요한 서비스입니다!');
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(loggedInUser);
            setUser(parsedUser);
            fetchAllMusic();
            fetchLikedMusicIds(parsedUser.loginId);
        }
    }, [navigate]);

    const handleSave = async () => {
        if (!videoId) {
            alert('유튜브 ID를 입력해주세요!');
            return;
        }
        if (isCustomTag && !customTagInput.trim()) {
            alert('직접 입력할 감성 태그를 적어주세요!');
            return;
        }

        const finalTag = isCustomTag
            ? (customTagInput.startsWith('#') ? customTagInput : `#${customTagInput}`)
            : moodTag;

        try {
            await axios.post('http://localhost:8080/api/music/save', {
                videoId: videoId,
                moodTag: finalTag,
                loginId: user.loginId,
                nickname: user.nickname
            });
            alert('저장 성공!');
            setVideoId('');
            setCustomTagInput('');
            fetchAllMusic();
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다.');
        }
    };

    const handleToggleLike = async (musicId) => {
        try {
            await axios.post(`http://localhost:8080/api/music/${musicId}/like?loginId=${user.loginId}`);
            fetchLikedMusicIds(user.loginId);
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        alert('로그아웃 되었습니다.');
        navigate('/login');
    };

    if (!user) return null;

    const adminMusicList = musicList.filter(music =>
        music.loginId === 'admin' && (selectedTag === '전체' || music.moodTag === selectedTag)
    );

    const socialMusicList = musicList
        .filter(music => music.loginId !== 'admin')
        .reverse();

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #eee' }}>
                <h1 style={{ margin: 0 }}>🎵 My Mood, My Music (M3)</h1>
                <div>
                    <span style={{ marginRight: '15px', fontWeight: 'bold' }}>{user.nickname} 님 환영합니다!</span>
                    {user.loginId === 'admin' && (
                        <button onClick={() => navigate('/admin')} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}>
                            ⚙️ 시스템 통계
                        </button>
                    )}
                    <button onClick={() => navigate('/mypage')} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}>
                        👤 마이페이지
                    </button>
                    <button onClick={handleLogout} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '5px' }}>
                        로그아웃
                    </button>
                </div>
            </div>

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
                    value={isCustomTag ? "직접입력" : moodTag}
                    onChange={(e) => {
                        if (e.target.value === "직접입력") {
                            setIsCustomTag(true);
                        } else {
                            setIsCustomTag(false);
                            setMoodTag(e.target.value);
                        }
                    }}
                    style={{ padding: '8px', marginRight: '10px' }}
                >
                    <option value="#코딩할때">#코딩할때</option>
                    <option value="#과제폭발_노동요">#과제폭발_노동요</option>
                    <option value="#드라이브">#드라이브</option>
                    <option value="#출퇴근길">#출퇴근길</option>
                    <option value="#운동할때">#운동할때</option>
                    <option value="#화창한날">#화창한날</option>
                    <option value="#비오는날">#비오는날</option>
                    <option value="#선선한밤">#선선한밤</option>
                    <option value="#새벽감성">#새벽감성</option>
                    <option value="#몽글몽글">#몽글몽글</option>
                    <option value="#신나는날">#신나는날</option>
                    <option value="#위로가필요해">#위로가필요해</option>
                    <option value="#잔잔한">#잔잔한</option>
                    <option value="#둠칫둠칫">#둠칫둠칫</option>
                    <option value="#스트레스해소">#스트레스해소</option>
                    <option value="직접입력">직접입력</option>
                </select>
                {isCustomTag && (
                    <input
                        type="text"
                        placeholder="태그 입력"
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        style={{ padding: '8px', marginRight: '10px', width: '150px' }}
                    />
                )}
                <button onClick={handleSave} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                    저장
                </button>
            </div>

            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['전체', '#코딩할때', '#새벽감성', '#신나는날', '#비오는날', '#몽글몽글', '#드라이브'].map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        style={{
                            padding: '5px 12px', borderRadius: '20px', border: '1px solid #007bff',
                            backgroundColor: selectedTag === tag ? '#007bff' : 'white',
                            color: selectedTag === tag ? 'white' : '#007bff', cursor: 'pointer', transition: '0.2s'
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <h2 style={{ color: '#ff8c00' }}>👑 M3 추천 플레이리스트</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                {adminMusicList.length > 0 ? adminMusicList.map((music) => (
                    <div key={music.id} style={{ border: '2px solid #ffce85', padding: '10px', borderRadius: '8px', backgroundColor: '#fff9f0' }}>
                        <a href={`https://www.youtube.com/watch?v=${music.videoId}`} target="_blank" rel="noopener noreferrer">
                            <img src={`https://img.youtube.com/vi/${music.videoId}/mqdefault.jpg`} alt={music.title} style={{ width: '100%', borderRadius: '4px' }} />
                        </a>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 5px 0' }}>
                            <h4 style={{ margin: 0, width: '85%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{music.title || '제목 없음'}</h4>
                            <span onClick={() => handleToggleLike(music.id)} style={{ cursor: 'pointer', fontSize: '20px' }}>
                                {likedMusicIds.includes(Number(music.id)) ? '❤️' : '🤍'}
                            </span>
                        </div>
                        <span style={{ color: '#ff8c00', fontWeight: 'bold' }}>{music.moodTag}</span>
                        {/* ✅ 관리자 추천곡에는 올린이 표시 없음 */}
                    </div>
                )) : <p style={{ color: '#888' }}>해당 태그의 공식 추천곡이 없습니다.</p>}
            </div>

            <h2 style={{ color: '#007bff' }}>🎧 모두의 플레이리스트</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {socialMusicList.length > 0 ? socialMusicList.map((music) => (
                    <div key={music.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                        <a href={`https://www.youtube.com/watch?v=${music.videoId}`} target="_blank" rel="noopener noreferrer">
                            <img src={`https://img.youtube.com/vi/${music.videoId}/mqdefault.jpg`} alt={music.title} style={{ width: '100%', borderRadius: '4px' }} />
                        </a>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 5px 0' }}>
                            <h4 style={{ margin: 0, width: '85%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{music.title || '제목 없음'}</h4>
                            <span onClick={() => handleToggleLike(music.id)} style={{ cursor: 'pointer', fontSize: '20px' }}>
                                {likedMusicIds.includes(Number(music.id)) ? '❤️' : '🤍'}
                            </span>
                        </div>
                        <span style={{ color: '#007bff', fontWeight: 'bold', marginRight: '10px' }}>{music.moodTag}</span>
                        {/* ✅ "계정명" → "올린이 - 닉네임" 형식으로 변경 */}
                        <span style={{ fontSize: '12px', color: '#666' }}>올린이 - {music.nickname || music.loginId || '알수없음'}</span>
                    </div>
                )) : <p style={{ color: '#888' }}>아직 등록된 소셜 추천곡이 없습니다.</p>}
            </div>

        </div>
    );
}

export default Home;