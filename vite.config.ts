import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

// 빌드마다 고유 번호를 붙이고 version.json으로도 내보낸다 (타이틀의 업데이트 확인 버튼이 비교한다)
const BUILD_ID = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
const GAME_VERSION = /GAME_VERSION = '([^']+)'/.exec(readFileSync(resolve(__dirname, 'src/config.ts'), 'utf8'))![1];

// 빌드 결과를 저장소 최상단(index.html, assets/)에 둔다.
// GitHub Pages를 "브랜치 그대로 배포"로 설정해도 게임이 바로 실행되게 하기 위해서다.
export default defineConfig({
  root: 'web',
  base: './',
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [
    {
      name: 'version-json',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: GAME_VERSION, build: BUILD_ID }) });
      },
    },
  ],
  build: {
    outDir: resolve(__dirname),
    emptyOutDir: false,
    target: 'es2022',
    chunkSizeWarningLimit: 1000,
  },
  // 테스트는 web/ 가 아니라 저장소 최상단의 tests/ 에서 찾는다
  test: {
    root: __dirname,
    include: ['tests/**/*.test.ts'],
  },
});
