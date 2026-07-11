import { NextResponse } from "next/server";
import { getTodoById, updateTodo, deleteTodo } from "@/lib/todo-store";
import { ApiResponse, Todo } from "@/types/todo";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const todo = getTodoById(id);

  if (!todo) {
    const response: ApiResponse<never> = {
      success: false,
      error: "Todo not found",
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: ApiResponse<Todo> = {
    success: true,
    data: todo,
  };
  return NextResponse.json(response);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const updates: Partial<Pick<Todo, "title" | "completed">> = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        const response: ApiResponse<never> = {
          success: false,
          error: "Title must be a non-empty string",
        };
        return NextResponse.json(response, { status: 400 });
      }
      updates.title = body.title.trim();
    }

    if (body.completed !== undefined) {
      if (typeof body.completed !== "boolean") {
        const response: ApiResponse<never> = {
          success: false,
          error: "Completed must be a boolean",
        };
        return NextResponse.json(response, { status: 400 });
      }
      updates.completed = body.completed;
    }

    const todo = updateTodo(id, updates);

    if (!todo) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Todo not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Todo> = {
      success: true,
      data: todo,
    };
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Invalid JSON body",
    };
    return NextResponse.json(response, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = deleteTodo(id);

  if (!deleted) {
    const response: ApiResponse<never> = {
      success: false,
      error: "Todo not found",
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: ApiResponse<{ id: string }> = {
    success: true,
    data: { id },
  };
  return NextResponse.json(response);
}
