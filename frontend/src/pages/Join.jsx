import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Join() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const handleJoin = async () => {
        try {
            await axios.post('https://port-0-musicmood-mqc1j4e6ba2e2cd6.sel3.cloudtype.app/api/user/join', {
                loginId: loginId,
                password: password,
                nickname: nickname
            });
            alert('회원가입 성공! 로그인해주세요.');
            navigate('/login'); 
        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>M3 회원가입</h2>
            <div style={{ marginBottom: '10px' }}>
                <input type="text" placeholder="아이디" value={loginId} onChange={e => setLoginId(e.target.value)} style={{ padding: '10px', width: '250px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px', width: '250px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="닉네임" value={nickname} onChange={e => setNickname(e.target.value)} style={{ padding: '10px', width: '250px' }} />
            </div>
            <button onClick={handleJoin} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>가입하기</button>
        </div>
    );
}

export default Join;