// src/hooks/useNotifications.ts
import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications는 NotificationProvider 내부에서만 사용할 수 있습니다.",
    );
  }
  return context;
}
