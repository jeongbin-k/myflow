import { useState, useEffect, type ReactNode } from "react";
import { supabase } from "../supabaseClient";
import { TodoContext } from "./TodoContext";
import type { Todo } from "./TodoContext";

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 수정 상태 추가
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  // 모달 상태 추가
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 1. supabase에서 전체 투두 리스트 가져오기
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

  // 2. 새 할 일 추가하기 (CREATE) - due_date 확장 반영
  const addTodo = async (title: string, category: string, dueDate?: string) => {
    // 만약dueDate 인자가 안 넘어오면, 로컬 브라우저 타임존 기준의 오늘 날짜(YYYY-MM-DD)를 기본값으로 사용합니다.
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const defaultTodayStr = `${year}-${month}-${date}`;

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            title,
            category,
            is_completed: false,
            due_date: dueDate ?? defaultTodayStr, // 넘겨받은 날짜가 없다면 오늘 날짜 기본 할당
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
  ) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ title, category, due_date: dueDate })
        .eq("id", id);

      if (error) throw error;

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? { ...todo, title, category, due_date: dueDate }
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

  // 웹이 켜지자마자 DB에서 데이터를 자동으로 긁어옴
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
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
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
