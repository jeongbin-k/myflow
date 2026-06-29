// src/utils/notificationMessages.ts

import type { NotificationSlot } from "../types/notification";

interface TodoLike {
  id: string;
  title: string;
  completed: boolean;
}

interface MessageResult {
  message: string;
  todoIds: string[];
}

// 진행중(미완료) 항목 이름을 ", "로 나열, 너무 많으면 "외 N건" 처리
function formatTodoNames(todos: TodoLike[], maxNames = 2): string {
  if (todos.length === 0) return "";
  const names = todos.slice(0, maxNames).map((t) => t.title);
  const rest = todos.length - names.length;
  return rest > 0 ? `${names.join(", ")} 외 ${rest}건` : names.join(", ");
}

export function buildNotificationMessage(
  slot: NotificationSlot,
  todayTodos: TodoLike[],
): MessageResult {
  const incomplete = todayTodos.filter((t) => !t.completed);

  switch (slot) {
    case "morning": {
      return {
        message: `오늘 할 일이 ${todayTodos.length}개 있어요`,
        todoIds: todayTodos.map((t) => t.id),
      };
    }
    case "midday": {
      if (incomplete.length === 0) {
        return { message: "오늘 할 일을 모두 끝냈어요", todoIds: [] };
      }
      return {
        message: `아직 진행 중인 일이 ${incomplete.length}개 있어요: ${formatTodoNames(incomplete)}`,
        todoIds: incomplete.map((t) => t.id),
      };
    }
    case "evening": {
      if (incomplete.length === 0) {
        return { message: "오늘 할 일을 모두 끝냈어요", todoIds: [] };
      }
      return {
        message: `오늘 안에 마무리 못한 일이 ${incomplete.length}개 있어요: ${formatTodoNames(incomplete)}`,
        todoIds: incomplete.map((t) => t.id),
      };
    }
  }
}
