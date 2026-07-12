import { Todo, ApiResponse } from "@/types/todo";

const API_BASE = "/api/todos";

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(API_BASE);
  const json: ApiResponse<Todo[]> = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.error ?? "Failed to fetch todos");
  }

  return json.data;
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const json: ApiResponse<Todo> = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.error ?? "Failed to create todo");
  }

  return json.data;
}

export async function toggleTodo(id: string, completed: boolean): Promise<Todo> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  const json: ApiResponse<Todo> = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.error ?? "Failed to update todo");
  }

  return json.data;
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  const json: ApiResponse<{ id: string }> = await res.json();

  if (!json.success) {
    throw new Error(json.error ?? "Failed to delete todo");
  }
}
