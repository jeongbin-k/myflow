// 공유 유틸 TodoToday.tsx, TodoMangeList.tsx

import type { Todo } from "../context/TodoContext";

/**
 * 주어진 날짜(targetDate, YYYY-MM-DD)가 todo의 기간에 포함되는지 판단.
 * - due_date: 시작일, end_date: 종료일 (네이밍은 헷갈리지만 현재 스키마 기준)
 * - end_date가 없으면 due_date 단일 날짜로 매칭 (기존 동작 호환)
 */
export function isTodoOnDate(todo: Todo, targetDate: string): boolean {
  if (!todo.due_date) return false;

  const start = todo.due_date;
  const end = todo.end_date ?? todo.due_date;

  return start <= targetDate && targetDate <= end;
}
