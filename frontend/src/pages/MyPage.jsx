import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // 닉네임 변경 상태
    const [newNickname, setNewNickname] = useState('');

    // 비밀번호 변경 상태 (3개로 분리!)
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [myMusicList, setMyMusicList] = useState([]);
    const [likedMusicList, setLikedMusicList] = useState([]);
    const [selectedTag, setSelectedTag] = useState('전체');

    const fetchMyMusic = async (loginId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/music/list?loginId=${loginId}`);
            setMyMusicList(response.data);
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        }
    };

    const fetchLikedMusic = async (loginId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/music/liked-music?loginId=${loginId}`);
            setLikedMusicList(response.data);
        } catch (error) {
            console.error('찜한 노래 가져오기 실패:', error);
        }
    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(loggedInUser);
            setUser(parsedUser);
            setNewNickname(parsedUser.nickname);
            fetchMyMusic(parsedUser.loginId);
            fetchLikedMusic(parsedUser.loginId);
        }
    }, [navigate]);

    const handleUpdateNickname = async () => {
        if (!newNickname.trim()) {
            alert('새 닉네임을 입력해주세요!');
            return;
        }
        try {
            const response = await axios.put('http://localhost:8080/api/user/update/nickname', {
                loginId: user.loginId,
                newNickname: newNickname
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            alert('닉네임이 성공적으로 변경되었습니다!');
        } catch (error) {
            alert(`닉네임 변경 실패: ${error.response?.data || '오류가 발생했습니다.'}`);
        }
    };

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('비밀번호 변경 항목을 모두 입력해주세요!');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:8080/api/user/update/password', {
                loginId: user.loginId,
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            alert('비밀번호가 안전하게 변경되었습니다!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            alert(`비밀번호 변경 실패: ${error.response?.data || '오류가 발생했습니다.'}`);
        }
    };

    const handleToggleLike = async (musicId) => {
        try {
            await axios.post(`http://localhost:8080/api/music/${musicId}/like?loginId=${user.loginId}`);
            fetchLikedMusic(user.loginId);
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    };

    if (!user) return null;

    const filteredMyMusic = myMusicList.filter(music =>
        selectedTag === '전체' || music.moodTag === selectedTag
    );

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <h1 style={{ margin: 0 }}>👤 마이페이지</h1>
                <button onClick={() => navigate('/')} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
                    🏠 홈으로 돌아가기
                </button>
            </div>

            {/* 회원정보 수정 섹션 */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                {/* 닉네임 변경 박스 */}
                <div style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h3 style={{ marginTop: 0 }}>닉네임 변경</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>아이디: <b>{user.loginId}</b></p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="새 닉네임 입력"
                            value={newNickname}
                            onChange={e => setNewNickname(e.target.value)}
                            style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <button onClick={handleUpdateNickname} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', whiteSpace: 'nowrap' }}>변경</button>
                    </div>
                </div>

                {/* 비밀번호 변경 박스 */}
                <div style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h3 style={{ marginTop: 0 }}>비밀번호 변경</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="password"
                            placeholder="현재 비밀번호 입력"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <input
                            type="password"
                            placeholder="새 비밀번호 입력"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <input
                            type="password"
                            placeholder="새 비밀번호 확인"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <button onClick={handleUpdatePassword} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', marginTop: '5px' }}>비밀번호 안전하게 변경</button>
                    </div>
                </div>
            </div>

            {/* 내가 올린 플레이리스트 섹션 */}
            <h2 style={{ color: '#8a2be2' }}>🎵 내가 올린 플레이리스트 ({myMusicList.length}곡)</h2>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['전체', '#코딩할때', '#새벽감성', '#신나는날', '#그루비'].map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        style={{
                            padding: '5px 12px', borderRadius: '20px', border: '1px solid #8a2be2',
                            backgroundColor: selectedTag === tag ? '#8a2be2' : 'white',
                            color: selectedTag === tag ? 'white' : '#8a2be2', cursor: 'pointer', transition: '0.2s'
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                {filteredMyMusic.length > 0 ? filteredMyMusic.map((music) => (
                    <div key={music.id} style={{ border: '2px solid #eee', padding: '10px', borderRadius: '8px' }}>
                        <a href={`https://www.youtube.com/watch?v=${music.videoId}`} target="_blank" rel="noopener noreferrer">
                            <img src={`https://img.youtube.com/vi/${music.videoId}/mqdefault.jpg`} alt={music.title} style={{ width: '100%', borderRadius: '4px' }} />
                        </a>
                        <h4 style={{ margin: '10px 0 5px 0' }}>{music.title || '제목 없음'}</h4>
                        <span style={{ color: '#8a2be2', fontWeight: 'bold' }}>{music.moodTag}</span>
                    </div>
                )) : <p style={{ color: '#888' }}>해당 태그에 등록한 내 음악이 없습니다.</p>}
            </div>

            {/* 🌟 수정된 '내가 찜한 플레이리스트' 섹션 */}
            <h2 style={{ color: '#e0245e' }}>❤️ 내가 찜한 플레이리스트 ({likedMusicList.length}곡)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                {likedMusicList.length > 0 ? likedMusicList.map((music) => (
                    <div key={music.id} style={{ border: '2px solid #ffe8ef', backgroundColor: '#fff5f8', padding: '10px', borderRadius: '8px' }}>
                        <a href={`https://www.youtube.com/watch?v=${music.videoId}`} target="_blank" rel="noopener noreferrer">
                            <img src={`https://img.youtube.com/vi/${music.videoId}/mqdefault.jpg`} alt={music.title} style={{ width: '100%', borderRadius: '4px' }} />
                        </a>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 5px 0' }}>
                            <h4 style={{ margin: 0, width: '85%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{music.title || '제목 없음'}</h4>
                            <span onClick={() => handleToggleLike(music.id)} style={{ cursor: 'pointer', fontSize: '20px' }}>❤️</span>
                        </div>

                        <span style={{ color: '#e0245e', fontWeight: 'bold', marginRight: '10px' }}>{music.moodTag}</span>

                        {/* 🌟 핵심 로직: 관리자면 '공식 추천', 유저면 '닉네임' 띄우기! */}
                        {music.loginId === 'admin' ? (
                            <span style={{ fontSize: '12px', color: '#ff8c00', fontWeight: 'bold' }}>👑 공식 추천곡</span>
                        ) : (
                            <span style={{ fontSize: '12px', color: '#666' }}>올린이 : {music.nickname || music.loginId || '알수없음'}</span>
                        )}
                    </div>
                )) : <p style={{ color: '#888' }}>아직 하트를 누른 곡이 없습니다. 홈에서 마음에 드는 곡을 찜해보세요!</p>}
            </div>

        </div>
    );
}

export default MyPage;