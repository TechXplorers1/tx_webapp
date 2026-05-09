// src/utils/idbCache.js
// Shared IndexedDB caching utility — imported by all components
// Replaces the copy-pasted openDB/dbGet/dbSet code in 6 different files

const IDB_CONFIG = { name: 'AppCacheDB', version: 1, store: 'firebase_cache' };

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_CONFIG.name, IDB_CONFIG.version);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_CONFIG.store)) {
        db.createObjectStore(IDB_CONFIG.store);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Read a cached value from IndexedDB by key.
 * @param {string} key
 * @returns {Promise<any>} The cached value, or undefined if not found.
 */
export const dbGet = async (key) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_CONFIG.store, 'readonly');
    const request = transaction.objectStore(IDB_CONFIG.store).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Write a value into IndexedDB at the given key.
 * @param {string} key
 * @param {any} val
 * @returns {Promise<void>}
 */
export const dbSet = async (key, val) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_CONFIG.store, 'readwrite');
    const request = transaction.objectStore(IDB_CONFIG.store).put(val, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Delete a cached entry by key.
 * @param {string} key
 * @returns {Promise<void>}
 */
export const dbDelete = async (key) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_CONFIG.store, 'readwrite');
    const request = transaction.objectStore(IDB_CONFIG.store).delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Helper: fetch data from Firebase with IDB caching.
 * Returns cached data if fresh, otherwise fetches from Firebase and updates cache.
 *
 * @param {Function} fetchFn  - async function that returns fresh data
 * @param {string}   cacheKey - IDB key to store the data under
 * @param {number}   ttlMins  - how many minutes the cache is valid (default: 10)
 * @returns {Promise<any>}
 */
export const getCachedData = async (fetchFn, cacheKey, ttlMins = 10) => {
  try {
    const cached = await dbGet(cacheKey);
    if (cached) {
      const age = new Date().getTime() - (cached.timestamp || 0);
      if (age < ttlMins * 60 * 1000) {
        console.log(`[IDB Cache HIT] ${cacheKey}`);
        return cached.data;
      }
    }

    console.log(`[IDB Cache MISS] Fetching fresh: ${cacheKey}`);
    const data = await fetchFn();

    if (data !== null && data !== undefined) {
      await dbSet(cacheKey, { data, timestamp: new Date().getTime() });
    }

    return data;
  } catch (err) {
    console.error(`[IDB Cache Error] ${cacheKey}:`, err);
    return null;
  }
};
