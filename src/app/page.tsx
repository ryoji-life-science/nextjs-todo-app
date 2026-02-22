import { TodoList } from "./todo-list";

export default function Home() {
  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>
        <TodoList />
      </div>
    </main>
  );
}
