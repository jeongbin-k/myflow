import { useContext } from "react";
import { TodoContext } from "../context/TodoContext";
import type { TodoContextType } from "../context/TodoContext";

export function useTodos(): TodoContextType {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos는 TodoProvider 안에서만 쓸 수 있습니다!");
  }
  return context;
}
