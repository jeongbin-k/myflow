// src/utils/dateRangeFilter.ts

export type DateFilterKey =
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "last3months"
  | "thisYear"
  | "lastYear";

export type DateFilterOption = {
  key: DateFilterKey;
  label: string;
};

function toDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 그 날짜가 속한 주의 일요일(주 시작)을 반환
function getWeekStart(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay()); // 일요일로 이동
  return d;
}

function getWeekEnd(weekStart: Date) {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6); // 토요일
  return d;
}

// 필터 옵션 목록 생성 (올해/작년은 동적으로 계산되어, 연도가 바뀌면 자동으로 갱신됨)
export function getDateFilterOptions(
  today: Date = new Date(),
): DateFilterOption[] {
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;

  return [
    { key: "thisWeek", label: "이번주" },
    { key: "lastWeek", label: "지난주" },
    { key: "thisMonth", label: "이번달" },
    { key: "lastMonth", label: "저번달" },
    { key: "last3months", label: "최근 3개월" },
    { key: "thisYear", label: `${currentYear}` },
    { key: "lastYear", label: `${lastYear}` },
  ];
}

// 선택된 필터 키에 따라 [startDateStr, endDateStr] 범위를 반환 (둘 다 포함, inclusive)
export function getDateRangeForFilter(
  filterKey: DateFilterKey,
  today: Date = new Date(),
): { start: string; end: string } {
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  switch (filterKey) {
    case "thisWeek": {
      const start = getWeekStart(today);
      const end = getWeekEnd(start);
      return { start: toDateStr(start), end: toDateStr(end) };
    }

    case "lastWeek": {
      const thisWeekStart = getWeekStart(today);
      const start = new Date(thisWeekStart);
      start.setDate(start.getDate() - 7);
      const end = getWeekEnd(start);
      return { start: toDateStr(start), end: toDateStr(end) };
    }

    case "thisMonth": {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0); // 이번달 마지막날
      return { start: toDateStr(start), end: toDateStr(end) };
    }

    case "lastMonth": {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0); // 저번달 마지막날
      return { start: toDateStr(start), end: toDateStr(end) };
    }

    case "last3months": {
      // 오늘 기준 롤링 90일
      const end = new Date(today);
      const start = new Date(today);
      start.setDate(start.getDate() - 89); // 오늘 포함 90일
      return { start: toDateStr(start), end: toDateStr(end) };
    }

    case "thisYear": {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      return { start: toDateStr(start), end: toDateStr(end) };
    }

    case "lastYear": {
      const start = new Date(year - 1, 0, 1);
      const end = new Date(year - 1, 11, 31);
      return { start: toDateStr(start), end: toDateStr(end) };
    }
  }
}
