import { createContext } from "react";
import type { NotificationRecord } from "../types/notification";

export interface NotificationContextType {
  notifications: NotificationRecord[];
  unseenCount: number;
  markAllAsSeen: () => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
