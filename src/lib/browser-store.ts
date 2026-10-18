"use client";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("venizor-storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("venizor-storage", callback);
  };
}
export function useStoredValue(key: string) {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
}
export function storeValue(key: string, value: string) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event("venizor-storage"));
}
