import { useState, useEffect, type ReactNode } from "react";
import { supabase } from "../supabaseClient";
import { TodoContext } from "./TodoContext";
import type { Todo, Category } from "./TodoContext";

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 수정 상태 추가
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  // 모달 상태 추가
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 카테고리 상태 추가
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);

  // 할일 모드 무조건 오늘날짜로 들어가야해서 모달이 열릴 때 기본으로 채워질 날짜를 저장하는 state
  const [defaultModalDate, setDefaultModalDate] = useState<string | null>(null);
  const openModalForDate = (dateStr: string) => {
    setDefaultModalDate(dateStr);
    setIsModalOpen(true);
  };
  // supabase에서 전체 투두 리스트 가져오기
  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data) setTodos(data);
    } catch (error) {
      console.error("데이터를 불러오지 못했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  };

  // supabase에서 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data) setCategories(data);
    } catch (error) {
      console.error("카테고리를 불러오지 못했습니다.", error);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  //

  // 새 카테고리 추가
  const addCategory = async (name: string): Promise<Category | null> => {
    const trimmed = name.trim();
    if (!trimmed) return null;

    // 이미 있는 이름이면 그냥 기존 카테고리 반환 (중복 추가 방지)
    const existing = categories.find((c) => c.name === trimmed);
    if (existing) return existing;

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name: trimmed }])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setCategories((prev) => [...prev, data[0]]);
        return data[0];
      }
      return null;
    } catch (error) {
      console.error("카테고리 추가 실패", error);
      return null;
    }
  };

  // 카테고리 삭제
  const deleteCategory = async (id: number, name: string) => {
    const inUse = todos.some((todo) => todo.category === name);

    if (inUse) {
      const confirmed = window.confirm(
        `"${name}" 카테고리를 사용 중인 할 일이 있습니다. 그래도 삭제하시겠습니까?\n(기존 할 일은 유지되지만, 더 이상 이 카테고리를 선택할 수 없습니다)`,
      );
      if (!confirmed) return;
    }

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("카테고리 삭제 실패", error);
    }
  };
  // 2. 새 할 일 추가하기 (CREATE) - due_date 확장 반영
  const addTodo = async (
    title: string,
    category: string,
    dueDate?: string,
    endDate?: string,
    color?: string,
    memo?: string,
  ) => {
    // 만약dueDate 인자가 안 넘어오면, 로컬 브라우저 타임존 기준의 오늘 날짜(YYYY-MM-DD)를 기본값으로 사용합니다.
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const defaultTodayStr = `${year}-${month}-${date}`;

    const finalStart = dueDate ?? defaultTodayStr;
    const finalEnd = endDate ?? finalStart; // end_date 없으면 시작일과 동일(1일짜리)

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            title,
            category,
            is_completed: false,
            due_date: finalStart,
            end_date: finalEnd,
            color: color ?? "blue",
            memo: memo?.trim() ? memo.trim() : null,
          },
        ])
        .select();

      if (error) throw error;
      if (data) {
        setTodos((prev) => [...prev, data[0]]);
      }
    } catch (error) {
      console.error("할 일 추가 실패", error);
    }
  };

  // 3. 할 일 완료 상태 토글 체크박스 클릭시
  const toggleTodo = async (id: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    // 완료 체크 시 현재 시간 기록, 해제 시 null 처리
    const completedAtValue = nextStatus ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from("todos")
        .update({ is_completed: nextStatus, completed_at: completedAtValue })
        .eq("id", id);

      if (error) throw error;

      // 로컬 상태도 실시간 동기화해서 화면으로 바로 바꿈
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                is_completed: nextStatus,
                completed_at: completedAtValue,
              }
            : todo,
        ),
      );
    } catch (error) {
      console.error("상태 변경 실패", error);
    }
  };

  // 4. 할 일 수정하기 (UPDATE)
  const updateTodo = async (
    id: number,
    title: string,
    category: string,
    dueDate: string,
    endDate: string,
    color: string,
  ) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({
          title,
          category,
          due_date: dueDate,
          end_date: endDate,
          color,
        })
        .eq("id", id);

      if (error) throw error;

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                title,
                category,
                due_date: dueDate,
                end_date: endDate,
                color,
              }
            : todo,
        ),
      );
    } catch (error) {
      console.log("할 일 수정 실패", error);
    }
  };

  // 할일 삭제하기 (DELETE)
  const deleteTodo = async (id: number) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log("할 일 삭제 실패", error);
    }
  };

  // 할 일 메모 수정 (UPSERT 느낌, memo 컬럼만 업데이트)
  const updateMemo = async (id: number, memo: string) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ memo })
        .eq("id", id);

      if (error) throw error;

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, memo } : todo)),
      );
    } catch (error) {
      console.log("메모 저장 실패", error);
    }
  };

  // 웹이 켜지자마자 DB에서 데이터를 자동으로 긁어옴
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
    fetchCategories();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        fetchTodos,
        addTodo,
        toggleTodo,
        isModalOpen,
        setIsModalOpen,
        updateTodo,
        deleteTodo,
        editingTodo,
        setEditingTodo,
        categories,
        isCategoriesLoading,
        addCategory,
        deleteCategory,
        defaultModalDate,
        openModalForDate,
        setDefaultModalDate,
        updateMemo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
