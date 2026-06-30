// src/contexts/NotificationProvider.tsx
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NotificationContext } from "./NotificationContext";
import { useTodos } from "../hooks/useTodos";
import { useAuth } from "../hooks/useAuth";
import { isTodoOnDate } from "../utils/todoDateRange";
import { buildNotificationMessage } from "../utils/notificationMessages";
import {
  loadNotifications,
  saveNotifications,
  pruneOldNotifications,
} from "../utils/notificationStorage";
import {
  SLOT_ORDER,
  SLOT_TIMES,
  type NotificationRecord,
  type NotificationSlot,
} from "../types/notification";

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSlotPassed(slot: NotificationSlot, now: Date): boolean {
  const { hour, minute } = SLOT_TIMES[slot];
  const slotTime = new Date(now);
  slotTime.setHours(hour, minute, 0, 0);
  return now.getTime() >= slotTime.getTime();
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { todos, isLoading } = useTodos();
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  const todosRef = useRef(todos);
  const notificationsRef = useRef(notifications);

  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  // userId가 준비되면 그 사용자의 저장된 알림을 불러옴
  useEffect(() => {
    if (!userId) return;
    const loaded = pruneOldNotifications(loadNotifications(userId));
    notificationsRef.current = loaded;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotifications(loaded);
  }, [userId]);

  useEffect(() => {
    if (isLoading || !userId) return;

    function checkAndCreateMissingNotifications() {
      const now = new Date();
      const todayStr = getTodayStr();
      const existing = notificationsRef.current;

      const alreadyExists = (slot: NotificationSlot) =>
        existing.some((n) => n.date === todayStr && n.slot === slot);

      const newRecords: NotificationRecord[] = [];

      for (const slot of SLOT_ORDER) {
        if (!isSlotPassed(slot, now)) continue;
        if (alreadyExists(slot)) continue;

        const todayTodos = todosRef.current.filter((t) =>
          isTodoOnDate(t, todayStr),
        );

        if (todayTodos.length === 0) continue; // 오늘 할 일이 없으면 알림 생성 안 함

        const { message, todoIds } = buildNotificationMessage(slot, todayTodos);

        newRecords.push({
          id: `${todayStr}-${slot}`,
          slot,
          date: todayStr,
          triggeredAt: now.toISOString(),
          seen: false,
          message,
          todoIds,
        });
      }

      if (newRecords.length > 0) {
        const updated = pruneOldNotifications([...existing, ...newRecords]);
        notificationsRef.current = updated;
        setNotifications(updated);
        saveNotifications(userId!, updated);
      }
    }

    checkAndCreateMissingNotifications();
    const intervalId = setInterval(checkAndCreateMissingNotifications, 60_000);
    return () => clearInterval(intervalId);
  }, [isLoading, userId]);

  const markAllAsSeen = () => {
    if (!userId) return;
    const updated = notificationsRef.current.map((n) =>
      n.seen ? n : { ...n, seen: true },
    );
    notificationsRef.current = updated;
    setNotifications(updated);
    saveNotifications(userId, updated);
  };

  const unseenCount = notifications.filter((n) => !n.seen).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unseenCount, markAllAsSeen }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
