const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 3;

type ContactRateLimitStore = Map<string, number[]>;

declare global {
  var __contactRateLimitStore: ContactRateLimitStore | undefined;
}

function getContactRateLimitStore() {
  if (!globalThis.__contactRateLimitStore) {
    globalThis.__contactRateLimitStore = new Map();
  }

  return globalThis.__contactRateLimitStore;
}

export function takeContactRateLimitSlot(identifier: string, now = Date.now()) {
  const store = getContactRateLimitStore();
  const windowStart = now - CONTACT_RATE_LIMIT_WINDOW_MS;
  const recentHits = (store.get(identifier) ?? []).filter((timestamp) => timestamp > windowStart);

  if (recentHits.length >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    store.set(identifier, recentHits);
    return false;
  }

  recentHits.push(now);
  store.set(identifier, recentHits);
  return true;
}

export function resetContactRateLimitForTest() {
  getContactRateLimitStore().clear();
}
