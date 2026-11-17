"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_STORAGE_KEY = "eden-theme";
const THEME_EVENT = "eden-theme-change";

function subscribeToTheme(callback: () => void) {
  const onTheme = () => callback();
  window.addEventListener(THEME_EVENT, onTheme);
  window.addEventListener("storage", onTheme);
  return () => {
    window.removeEventListener(THEME_EVENT, onTheme);
    window.removeEventListener("storage", onTheme);
  };
}

function getIsDarkSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

/** Accessible light/dark mode toggle synced with html.dark and localStorage. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getIsDarkSnapshot,
    () => false
  );

  function toggleTheme() {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextDark ? "dark" : "light");
    } catch {
      // Ignore storage failures in restricted browsing contexts
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`glass-pill group btn-interactive inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-eden-ink active:scale-90 hover:scale-105 transition-all duration-200 sm:h-10 sm:w-10 ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#DFBA73] transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
      ) : (
        <Moon className="h-4 w-4 text-eden-ink transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-[#C5A059]" />
      )}
    </button>
  );
}

