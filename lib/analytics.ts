"use client";
import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const SESSION_KEY = "ns_session";
const VISITED_KEY = "ns_visited";
const SESSION_WINDOW_MS = 30 * 60 * 1000; // 30min rolling window

interface SessionInfo {
  sessionId: string;
  isNewVisitor: boolean;
}

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Reads/creates the rolling-window session id from localStorage. Returns
// isNewVisitor=true only the very first time this browser is ever seen.
export function getOrCreateSession(): SessionInfo | null {
  if (typeof window === "undefined") return null;

  const hasVisited = window.localStorage.getItem(VISITED_KEY);
  const isNewVisitor = !hasVisited;
  if (isNewVisitor) window.localStorage.setItem(VISITED_KEY, "1");

  const now = Date.now();
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { id: string; lastActive: number };
      if (now - parsed.lastActive < SESSION_WINDOW_MS) {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify({ id: parsed.id, lastActive: now }));
        return { sessionId: parsed.id, isNewVisitor: false };
      }
    } catch {
      // fall through to create a new session
    }
  }

  const id = randomId();
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ id, lastActive: now }));
  return { sessionId: id, isNewVisitor };
}

export function getDeviceType(): "mobile" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

type EventType = "pageview" | "product_view" | "add_to_cart" | "checkout_started" | "order_placed";

interface TrackExtra {
  path?: string;
  productId?: string;
  productTitle?: string;
  value?: number;
}

export function useTrackEvent() {
  const log = useMutation(api.analytics.log);

  return useCallback(
    (type: EventType, extra: TrackExtra = {}) => {
      const session = getOrCreateSession();
      if (!session) return;
      log({
        sessionId: session.sessionId,
        type,
        device: getDeviceType(),
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
        isNewVisitor: session.isNewVisitor,
        ...extra,
      }).catch(() => {});
    },
    [log]
  );
}
