// 앱 아이콘 생성: vite 개발 서버로 scripts/icon 을 열고 3D 장면을 PNG로 저장한다
// 사용법: node scripts/make-icons.mjs [출력폴더]   (playwright 필요)
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { execSync } from 'node:child_process';

// playwright는 전역 설치본을 쓴다 (프로젝트 의존성에 넣지 않음)
const pw = await import('playwright').catch(() => import(resolve(execSync('npm root -g').toString().trim(), 'playwright/index.mjs')));
const { chromium } = pw.default ?? pw;

const out = resolve(process.argv[2] ?? 'web/public');
const server = await createServer({ configFile: false, root: resolve('scripts/icon'), server: { port: 5191 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('pageerror', (e) => console.error(e.message));
await page.goto('http://localhost:5191/');
await page.waitForFunction(() => window.ready, null, { timeout: 30000 });
const jobs = [
  ['icon-512.png', 512, false],
  ['icon-192.png', 192, false],
  ['icon-maskable-512.png', 512, true],
  ['icon-180.png', 180, true], // iOS는 스스로 모서리를 깎는다
  ['favicon-64.png', 64, false],
];
for (const [name, size, maskable] of jobs) {
  const url = await page.evaluate((o) => window.render(o), { size, maskable });
  writeFileSync(resolve(out, name), Buffer.from(url.split(',')[1], 'base64'));
  console.log('wrote', name);
}
await browser.close();
await server.close();
