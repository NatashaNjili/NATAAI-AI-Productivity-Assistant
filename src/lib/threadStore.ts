/**
 * Keeps feature threads alive across page navigation.
 * Text threads are persisted to localStorage; image threads (large data URLs)
 * live in memory only for the session.
 */

const memory = new Map<string, unknown>();

const keyFor = (k: string) => `nata:thread:${k}`;

export function loadThread<T>(key: string, fallback: T, persist = true): T {
  if (memory.has(key)) return memory.get(key) as T;
  if (persist) {
    try {
      const raw = localStorage.getItem(keyFor(key));
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        memory.set(key, parsed);
        return parsed;
      }
    } catch {
      /* ignore corrupt storage */
    }
  }
  return fallback;
}

export function saveThread<T>(key: string, value: T, persist = true) {
  memory.set(key, value);
  if (!persist) return;
  try {
    localStorage.setItem(keyFor(key), JSON.stringify(value));
  } catch {
    /* quota exceeded — memory copy still works for this session */
  }
}

export function clearThread(key: string) {
  memory.delete(key);
  try {
    localStorage.removeItem(keyFor(key));
  } catch {
    /* ignore */
  }
}
