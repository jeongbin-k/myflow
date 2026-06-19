import { useState, useEffect, type ReactNode } from "react";
import { supabase } from "../supabaseClient";
import { TodoContext } from "./TodoContext";
import type { Todo } from "./TodoContext";

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // 2. 새 할 일 추가하기 (CREATE)
  const addTodo = async (title: string, category: string) => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ title, category, is_completed: false }])
        .select();

      if (error) throw error;
      if (data) {
        setTodos((prev) => [...prev, data[0]]);
      }
    } catch (error) {
      console.error("할 일 추가 실패", error);
    }
  };

  //3. 할 일 완료 상태 토글 체크박스 클릭시 (UPDATE)
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

  // 4. 웹이 켜지자마자 DB에서 데이터를 자동으로 긁어옴
  useEffect(() => {
    // fetchTodos 내부의 setState는 모두 await 이후(비동기 콜백)에서 호출되므로
    // 실제로는 effect와 동기적으로 실행되지 않습니다. (lint 정적분석의 false positive)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
  }, []);

  return (
    <TodoContext.Provider
      value={{ todos, isLoading, fetchTodos, addTodo, toggleTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
}

// 컴포넌트들이 이 훅을 불러와서 데이터를 편하게 꺼내 씀
// => useTodos.ts 로 보냄 커스텀훅
