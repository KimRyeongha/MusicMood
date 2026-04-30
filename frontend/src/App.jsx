import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Join from './pages/Join';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import AdminStats from './pages/AdminStats';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/mypage" element={<MyPage />} /> 
                <Route path="/admin" element={<AdminStats />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;