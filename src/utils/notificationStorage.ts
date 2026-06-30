// src/utils/notificationStorage.ts

import type { NotificationRecord } from "../types/notification";

function getStorageKey(userId: string): string {
  return `myflow:notifications:${userId}`;
}

export function loadNotifications(userId: string): NotificationRecord[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as NotificationRecord[];
  } catch {
    return [];
  }
}

export function saveNotifications(
  userId: string,
  records: NotificationRecord[],
): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(records));
  } catch {
    // localStorage 용량 초과 등의 예외는 조용히 무시 (알림은 비핵심 기능)
  }
}

// 오래된 알림 정리 (예: 7일 이상 지난 것은 제거) - 무한정 쌓이는 것 방지
export function pruneOldNotifications(
  records: NotificationRecord[],
  keepDays = 7,
): NotificationRecord[] {
  const cutoff = Date.now() - keepDays * 24 * 60 * 60 * 1000;
  return records.filter((r) => new Date(r.triggeredAt).getTime() >= cutoff);
}
