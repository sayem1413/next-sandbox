import { Todo } from "@/types/todo";

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Learn Next.js App Router",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Build a todo API with JSON responses",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Connect the frontend to the API",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

let todos: Todo[] = [...initialTodos];

export function getAllTodos(): Todo[] {
  return todos;
}

export function getTodoById(id: string): Todo | undefined {
  return todos.find((todo) => todo.id === id);
}

export function createTodo(title: string): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos = [todo, ...todos];
  return todo;
}

export function updateTodo(
  id: string,
  updates: Partial<Pick<Todo, "title" | "completed">>
): Todo | null {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return null;

  todos[index] = { ...todos[index], ...updates };
  return todos[index];
}

export function deleteTodo(id: string): boolean {
  const lengthBefore = todos.length;
  todos = todos.filter((todo) => todo.id !== id);
  return todos.length < lengthBefore;
}

export function resetTodos(): void {
  todos = [...initialTodos];
}
