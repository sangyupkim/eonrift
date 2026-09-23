import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// 빌드 결과를 저장소 최상단(index.html, assets/)에 둔다.
// GitHub Pages를 "브랜치 그대로 배포"로 설정해도 게임이 바로 실행되게 하기 위해서다.
export default defineConfig({
  root: 'web',
  base: './',
  build: {
    outDir: resolve(__dirname),
    emptyOutDir: false,
    target: 'es2022',
    chunkSizeWarningLimit: 1000,
  },
});
