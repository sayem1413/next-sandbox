import { NextResponse } from "next/server";
import { getAllTodos, createTodo } from "@/lib/todo-store";
import { ApiResponse, Todo } from "@/types/todo";

export async function GET() {
  const todos = getAllTodos();
  const response: ApiResponse<Todo[]> = {
    success: true,
    data: todos,
  };
  return NextResponse.json(response);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Title is required and must be a non-empty string",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const todo = createTodo(body.title.trim());
    const response: ApiResponse<Todo> = {
      success: true,
      data: todo,
    };
    return NextResponse.json(response, { status: 201 });
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Invalid JSON body",
    };
    return NextResponse.json(response, { status: 400 });
  }
}
