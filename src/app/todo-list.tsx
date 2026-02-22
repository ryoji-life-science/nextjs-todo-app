"use client";

import { useState, useEffect, useCallback } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "todos";

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTodos(loadTodos());
    setMounted(true);
  }, []);

  const persist = useCallback((next: Todo[]) => {
    setTodos(next);
    saveTodos(next);
  }, []);

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setNewTitle("");
    persist([todo, ...todos]);
  }

  function handleToggle(id: string) {
    persist(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleDelete(id: string) {
    persist(todos.filter((t) => t.id !== id));
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 h-12" />
        <p className="text-center text-gray-400 py-8">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Add form */}
      <form onSubmit={handleAdd} className="flex border-b border-gray-200">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 bg-transparent outline-none placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="px-4 py-3 text-blue-600 font-medium hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          Add
        </button>
      </form>

      {/* Todo list */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          {todos.length === 0 ? "No todos yet" : "No matching todos"}
        </p>
      ) : (
        <ul>
          {filtered.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 group"
            >
              <button
                onClick={() => handleToggle(todo.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  todo.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-green-400"
                }`}
                aria-label={
                  todo.completed ? "Mark as active" : "Mark as completed"
                }
              >
                {todo.completed && (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                aria-label="Delete todo"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 border-t border-gray-200">
          <span>
            {activeCount} item{activeCount !== 1 ? "s" : ""} left
          </span>
          <div className="flex gap-1">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded transition-colors ${
                  filter === f
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                {f === "all" ? "All" : f === "active" ? "Active" : "Done"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
