import { useEffect, createContext } from "react";

export const CacheContext = createContext(null);

export function CacheProvider({ children }) {
  const map = new Map();

  function getCache(key) {
    const value = map.get(key);
    if (!value) return undefined;
    if (new Date().getTime() > value.expiry.getTime()) {
      map.delete(key);
      return undefined;
    }
    return value.data;
  }

  function setCache(key, value, ttl = 10) {
    var t = new Date();
    t.setSeconds(t.getSeconds() + ttl);
    map.set(key, {
      expiry: t,
      data: value,
    });
  }

  function clearCache() {
    map.clear();
  }

  function deleteCache(key) {
    map.delete(key);
  }

  const contextValue = {
    getCache,
    setCache,
    clearCache,
    deleteCache,
  };

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}

