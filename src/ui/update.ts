import { BUILD_ID } from '../config';

export interface RemoteVersion {
  version: string;
  build: string;
}

/** 서버(깃허브 페이지)에 올라간 최신 빌드 정보를 받아 온다. 실패하면 null */
export async function fetchRemoteVersion(): Promise<RemoteVersion | null> {
  try {
    const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as RemoteVersion;
  } catch {
    return null;
  }
}

export function isNewer(remote: RemoteVersion): boolean {
  return remote.build !== BUILD_ID && BUILD_ID !== 'dev';
}

/** 캐시를 비우고 새 버전으로 다시 연다 (저장 데이터는 그대로) */
export async function applyUpdate(remote: RemoteVersion): Promise<void> {
  try {
    const regs = (await navigator.serviceWorker?.getRegistrations()) ?? [];
    await Promise.all(regs.map((r) => r.update().catch(() => undefined)));
  } catch {
    /* 서비스 워커가 없는 환경 */
  }
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  } catch {
    /* 캐시 API가 없는 환경 */
  }
  const url = new URL(location.href);
  url.searchParams.set('v', remote.build);
  location.replace(url.toString());
}
