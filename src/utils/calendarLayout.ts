// src/utils/calendarLayout.ts
import type { Todo } from "../context/TodoContext";

export type CalendarCellDay = {
  type: "prev" | "current" | "next";
  day: number;
  dateStr: string; // "YYYY-MM-DD"
};

export type EventBar = {
  todo: Todo;
  startCol: number; // 그 주에서 시작 칸 (0~6)
  span: number; // 며칠 동안 이어지는지 (그 주 내에서)
  lane: number; // 수직 위치 (겹침 방지용)
  isStartOfEvent: boolean; // 이 바가 일정의 실제 첫 날인지 (아니면 이전 주에서 이어진 것)
  isEndOfEvent: boolean; // 실제 마지막 날인지
};

function parseDateStr(str: string) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 월간 그리드의 날짜 배열 생성 (이전달/다음달 빈칸 채움 없이, prev/next 실제 날짜로 채움)
export function generateMonthGrid(
  year: number,
  month: number,
): CalendarCellDay[] {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const totalDays = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: CalendarCellDay[] = [];

  // 이전 달 채우기 (실제 날짜로 — 클릭 가능해야 하므로)
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 2, day);
    days.push({ type: "prev", day, dateStr: toDateStr(date) });
  }

  // 현재 달
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month - 1, i);
    days.push({ type: "current", day: i, dateStr: toDateStr(date) });
  }

  // 다음 달 채우기 (6주 = 42칸 맞추기)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month, i);
    days.push({ type: "next", day: i, dateStr: toDateStr(date) });
  }

  return days;
}

// 주 단위(7일)로 쪼개고, 각 주마다 이벤트 바 + 레인 배정
export function layoutEventsForWeek(
  weekDays: CalendarCellDay[],
  todos: Todo[],
): EventBar[] {
  const weekStart = parseDateStr(weekDays[0].dateStr);
  const weekEnd = parseDateStr(weekDays[6].dateStr);

  // 이 주와 겹치는 todo만 필터링
  const relevantTodos = todos.filter((todo) => {
    if (!todo.due_date) return false;
    const start = parseDateStr(todo.due_date);
    const end = parseDateStr(todo.end_date ?? todo.due_date);
    return start <= weekEnd && end >= weekStart;
  });

  // 시작일 빠른 순, 같으면 기간 긴 순으로 정렬 (레인 배정 안정성을 위해)
  relevantTodos.sort((a, b) => {
    const aStart = parseDateStr(a.due_date!);
    const bStart = parseDateStr(b.due_date!);
    if (aStart.getTime() !== bStart.getTime())
      return aStart.getTime() - bStart.getTime();
    const aEnd = parseDateStr(a.end_date ?? a.due_date!);
    const bEnd = parseDateStr(b.end_date ?? b.due_date!);
    return bEnd.getTime() - aEnd.getTime();
  });

  const bars: EventBar[] = [];
  const laneOccupancy: boolean[][] = []; // laneOccupancy[lane][col] = true/false

  relevantTodos.forEach((todo) => {
    const trueStart = parseDateStr(todo.due_date!);
    const trueEnd = parseDateStr(todo.end_date ?? todo.due_date!);

    // 이 주 안에서 실제로 보여질 구간 계산 (주 경계로 자르기)
    const visibleStart = trueStart < weekStart ? weekStart : trueStart;
    const visibleEnd = trueEnd > weekEnd ? weekEnd : trueEnd;

    const startCol = Math.round(
      (visibleStart.getTime() - weekStart.getTime()) / 86400000,
    );
    const endCol = Math.round(
      (visibleEnd.getTime() - weekStart.getTime()) / 86400000,
    );
    const span = endCol - startCol + 1;

    // 빈 레인 찾기 (startCol~endCol 구간이 비어있는 가장 낮은 lane)
    let lane = 0;
    while (true) {
      if (!laneOccupancy[lane]) laneOccupancy[lane] = new Array(7).fill(false);
      const isFree = Array.from({ length: span }).every(
        (_, i) => !laneOccupancy[lane][startCol + i],
      );
      if (isFree) break;
      lane++;
    }
    for (let i = 0; i < span; i++) {
      laneOccupancy[lane][startCol + i] = true;
    }

    bars.push({
      todo,
      startCol,
      span,
      lane,
      isStartOfEvent: trueStart.getTime() === visibleStart.getTime(),
      isEndOfEvent: trueEnd.getTime() === visibleEnd.getTime(),
    });
  });

  return bars;
}

// 전체 월의 날짜를 7개씩 주 단위로 묶기
export function chunkIntoWeeks(days: CalendarCellDay[]): CalendarCellDay[][] {
  const weeks: CalendarCellDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}
