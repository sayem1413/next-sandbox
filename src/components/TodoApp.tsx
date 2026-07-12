"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
} from "@/lib/api";
import { Todo } from "@/types/todo";
import styles from "./todo-app.module.css";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    setSubmitting(true);
    setError(null);
    try {
      const todo = await createTodo(title);
      setTodos((prev) => [todo, ...prev]);
      setNewTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    setError(null);
    try {
      const updated = await toggleTodo(id, !completed);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    }
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Todo Demo</h1>
          <p className={styles.subtitle}>
            Next.js App Router + JSON API routes
          </p>
        </header>

        <form className={styles.form} onSubmit={handleAdd}>
          <input
            type="text"
            className={styles.input}
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={submitting}
            aria-label="New todo title"
          />
          <button
            type="submit"
            className={styles.addButton}
            disabled={submitting || !newTitle.trim()}
          >
            {submitting ? "Adding…" : "Add"}
          </button>
        </form>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <section className={styles.stats} aria-live="polite">
          {loading ? (
            <span>Loading todos…</span>
          ) : (
            <span>
              {completedCount} of {todos.length} completed
            </span>
          )}
        </section>

        <ul className={styles.list}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`${styles.item} ${todo.completed ? styles.completed : ""}`}
            >
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id, todo.completed)}
                  className={styles.checkbox}
                />
                <span className={styles.todoTitle}>{todo.title}</span>
              </label>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleDelete(todo.id)}
                aria-label={`Delete "${todo.title}"`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {!loading && todos.length === 0 && (
          <p className={styles.empty}>No todos yet. Add one above!</p>
        )}

        <footer className={styles.footer}>
          <p>API endpoints:</p>
          <code className={styles.code}>GET /api/todos</code>
          <code className={styles.code}>POST /api/todos</code>
          <code className={styles.code}>PATCH /api/todos/[id]</code>
          <code className={styles.code}>DELETE /api/todos/[id]</code>
        </footer>
      </div>
    </main>
  );
}
