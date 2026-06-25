import { createContext } from "react";

// 타입스크립트 투두 데이터 규격(Type)
export interface Todo {
  id: number;
  title: string;
  is_completed: boolean;
  category: string;
  created_at: string;
  completed_at: string | null;
  due_date: string | null; // 시작일 (start_date) 역할
  end_date: string | null; // 종료일
  updated_at: string;
  color: string;
  memo: string | null;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
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
    end_date?: string,
    color?: string,
  ) => Promise<void>;
  toggleTodo: (id: number, currentStatus: boolean) => Promise<void>;
  updateTodo: (
    id: number,
    title: string,
    category: string,
    dueDate: string,
    endDate: string,
    color: string,
  ) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  updateMemo: (id: number, memo: string) => Promise<void>;

  // "추가모드" , "수정 모드"를 하나의 모달같이 처리하게끔
  editingTodo: Todo | null;
  setEditingTodo: (todo: Todo | null) => void;

  // 모달 제어를 위한 상태 및 함수 추가 (6/20)
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;

  // 추가 (6/22)
  defaultModalDate: string | null;
  setDefaultModalDate: (date: string | null) => void;
  openModalForDate: (dateStr: string) => void;

  // 카테고리 관리 추가 (6/22)
  categories: Category[];
  isCategoriesLoading: boolean;
  addCategory: (name: string) => Promise<Category | null>;
  deleteCategory: (id: number, name: string) => Promise<void>;
}

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined,
);
