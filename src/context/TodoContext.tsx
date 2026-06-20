import { createContext } from "react";

// 타입스크립트 투두 데이터 규격(Type)
export interface Todo {
  id: number;
  title: string;
  is_completed: boolean;
  category: string;
  created_at: string;
  completed_at: string | null;
  due_date: string | null;
}
// 이 Context 안에서 다른 컴포넌트들에게 "내가 어떤 데이터랑 어떤 함수들을 전역으로 제공할게라고 명시하는 목록 리스트
export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  fetchTodos: () => Promise<void>;
  addTodo: (
    title: string,
    category: string,
    due_date?: string,
  ) => Promise<void>;
  toggleTodo: (id: number, currentStatus: boolean) => Promise<void>;

  // 모달 제어를 위한 상태 및 함수 추가 (6/20)
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined,
);
