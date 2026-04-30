import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminStats() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMusic: 0,
        totalLikes: 0
    });

    useEffect(() => {
        // 1. 관리자인지 철저하게 검사!
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            alert('로그인이 필요합니다!');
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(loggedInUser);
        if (parsedUser.loginId !== 'admin') {
            alert('접근 권한이 없습니다! (관리자 전용)');
            navigate('/');
            return;
        }

        // 2. 관리자가 맞으면 통계 데이터 싹 가져오기
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('통계 데이터 불러오기 실패:', error);
            }
        };

        fetchStats();
    }, [navigate]);

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ margin: 0, color: '#28a745' }}>⚙️ M3 시스템 통계 대시보드</h1>
                <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                    🏠 메인으로 돌아가기
                </button>
            </div>

            <p style={{ color: '#666', marginBottom: '40px', fontSize: '18px' }}>현재 M3 서비스의 실시간 운영 현황입니다.</p>

            {/* 통계 카드 3개 나란히 배치 */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>

                <div style={{ flex: 1, backgroundColor: '#e8f4f8', padding: '40px 20px', borderRadius: '15px', border: '2px solid #b6e3f4', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ margin: '0 0 15px 0', color: '#0077b6' }}>👥 총 가입자 수</h2>
                    <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#03045e' }}>{stats.totalUsers}</span>
                    <span style={{ fontSize: '20px', color: '#0077b6', marginLeft: '5px' }}>명</span>
                </div>

                <div style={{ flex: 1, backgroundColor: '#f3e8fd', padding: '40px 20px', borderRadius: '15px', border: '2px solid #dcb6f4', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ margin: '0 0 15px 0', color: '#7209b7' }}>🎵 누적 등록 음악</h2>
                    <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#3a0ca3' }}>{stats.totalMusic}</span>
                    <span style={{ fontSize: '20px', color: '#7209b7', marginLeft: '5px' }}>곡</span>
                </div>

                <div style={{ flex: 1, backgroundColor: '#fde8e8', padding: '40px 20px', borderRadius: '15px', border: '2px solid #f4b6b6', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ margin: '0 0 15px 0', color: '#d90429' }}>❤️ 총 발생한 하트</h2>
                    <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#800f2f' }}>{stats.totalLikes}</span>
                    <span style={{ fontSize: '20px', color: '#d90429', marginLeft: '5px' }}>개</span>
                </div>

            </div>
        </div>
    );
}

export default AdminStats;