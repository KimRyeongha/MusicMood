import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/login', {
                loginId: loginId,
                password: password
            });

            // 로그인 성공 시! 백엔드에서 받은 유저 정보(id, nickname 등)를 통째로 저장
            localStorage.setItem('user', JSON.stringify(response.data));

            alert(`${response.data.nickname}님 환영합니다!`);
            navigate('/'); // 메인 홈 화면으로 이동!
        } catch (error) {
            alert(error.response.data); // 비번 틀림, 아이디 없음 등
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>M3 로그인</h2>
            <div style={{ marginBottom: '10px' }}>
                <input type="text" placeholder="아이디" value={loginId} onChange={e => setLoginId(e.target.value)} style={{ padding: '10px', width: '250px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px', width: '250px' }} />
            </div>
            <button onClick={handleLogin} style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>로그인</button>
            <button onClick={() => navigate('/join')} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ddd', border: 'none', borderRadius: '5px' }}>회원가입하러 가기</button>
        </div>
    );
}

export default Login;