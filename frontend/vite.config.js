import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 원하는 포트 번호 입력 (8080으로 하실 거면 백엔드 포트를 나중에 바꿔야 함!)
  }
})
