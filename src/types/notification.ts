export type NotificationSlot = "morning" | "midday" | "evening";

export interface NotificationRecord {
  id: string; // `${date}-${slot}`, 예: "2026-06-29-morning"
  slot: NotificationSlot;
  date: string; // YYYY-MM-DD (로컬 기준)
  triggeredAt: string; // ISO timestamp
  seen: boolean;
  message: string;
  todoIds: string[];
}

export const SLOT_TIMES: Record<
  NotificationSlot,
  { hour: number; minute: number }
> = {
  morning: { hour: 9, minute: 0 },
  midday: { hour: 14, minute: 0 },
  evening: { hour: 17, minute: 0 },
};

export const SLOT_ORDER: NotificationSlot[] = ["morning", "midday", "evening"];
