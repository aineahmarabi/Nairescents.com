export const RANGE_KEYS = ["Today", "Yesterday", "Last 7 days", "Last 30 days", "Custom"] as const;
export type RangeKey = typeof RANGE_KEYS[number];

export interface RangeBounds {
  start: number;
  end: number;
  prevStart: number;
  prevEnd: number;
}

function startOfDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

export function getRangeBounds(key: RangeKey, custom?: { from: Date; to: Date }): RangeBounds {
  const now = Date.now();
  const todayStart = startOfDay(new Date());

  if (key === "Today") {
    const start = todayStart;
    const end = now;
    const len = end - start;
    return { start, end, prevStart: start - len, prevEnd: start };
  }
  if (key === "Yesterday") {
    const end = todayStart;
    const start = end - 24 * 60 * 60 * 1000;
    return { start, end, prevStart: start - 24 * 60 * 60 * 1000, prevEnd: start };
  }
  if (key === "Last 7 days") {
    const end = now;
    const start = end - 7 * 24 * 60 * 60 * 1000;
    return { start, end, prevStart: start - 7 * 24 * 60 * 60 * 1000, prevEnd: start };
  }
  if (key === "Last 30 days") {
    const end = now;
    const start = end - 30 * 24 * 60 * 60 * 1000;
    return { start, end, prevStart: start - 30 * 24 * 60 * 60 * 1000, prevEnd: start };
  }
  // Custom
  const start = custom ? startOfDay(custom.from) : todayStart;
  const end = custom ? startOfDay(custom.to) + 24 * 60 * 60 * 1000 : now;
  const len = end - start;
  return { start, end, prevStart: start - len, prevEnd: start };
}

export function pctChange(current: number, prev: number): number | undefined {
  if (prev === 0) return current > 0 ? 100 : undefined;
  return Math.round(((current - prev) / prev) * 1000) / 10;
}

/** Buckets a list of timestamps into N evenly-spaced counts across [start,end). */
export function bucketCounts(timestamps: number[], start: number, end: number): number[] {
  const span = end - start;
  if (span <= 0) return [];
  const hourly = span <= 36 * 60 * 60 * 1000;
  const bucketMs = hourly ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const count = Math.max(2, Math.min(30, Math.ceil(span / bucketMs)));
  const size = span / count;
  const buckets = new Array(count).fill(0);
  for (const t of timestamps) {
    if (t < start || t >= end) continue;
    const idx = Math.min(count - 1, Math.floor((t - start) / size));
    buckets[idx]++;
  }
  return buckets;
}

export function dayLabel(ts: number): string {
  return new Date(ts).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export interface BucketWindow { label: string; start: number; end: number }

/** Splits [start,end) into even buckets (hourly if span <= 36h, otherwise daily) with labels. */
export function bucketWindows(start: number, end: number): BucketWindow[] {
  const span = end - start;
  if (span <= 0) return [];
  const hourly = span <= 36 * 60 * 60 * 1000;
  const bucketMs = hourly ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const count = Math.max(2, Math.min(30, Math.ceil(span / bucketMs)));
  const size = span / count;
  const windows: BucketWindow[] = [];
  for (let i = 0; i < count; i++) {
    const wStart = start + i * size;
    const wEnd = start + (i + 1) * size;
    const label = hourly
      ? new Date(wStart).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      : dayLabel(wStart);
    windows.push({ label, start: wStart, end: wEnd });
  }
  return windows;
}
