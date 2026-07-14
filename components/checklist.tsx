"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { Check, Plus, X, Clock, AlertCircle } from "lucide-react";
import type { Task } from "@/lib/types";

export function Checklist({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    setTasks(data || []);
    setLoading(false);
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    const { data } = await supabase
      .from("tasks")
      .insert({ project_id: projectId, content: newTask.trim() })
      .select()
      .single();
    if (data) {
      setTasks([...tasks, data]);
      setNewTask("");
    }
  }

  async function toggleTask(id: string, completed: boolean) {
    await supabase.from("tasks").update({ completed: !completed }).eq("id", id);
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
  }

  async function deleteTask(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(tasks.filter((t) => t.id !== id));
  }

  if (loading) return <div className="text-dark-muted text-sm">Laster...</div>;

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div>
      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-dark-muted mb-1">
            <span>{completedCount}/{tasks.length} utført</span>
            <span>{Math.round((completedCount / tasks.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all"
              style={{ width: `${(completedCount / tasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-lg px-4 py-3 group"
          >
            <button
              onClick={() => toggleTask(task.id, task.completed)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? "bg-gold border-gold"
                  : "border-dark-border hover:border-gold"
              }`}
            >
              {task.completed && <Check size={14} className="text-black" />}
            </button>
            <span
              className={`flex-1 text-sm ${
                task.completed ? "line-through text-dark-muted" : "text-white"
              }`}
            >
              {task.content}
            </span>
            {task.assigned_to && (
              <span className="text-xs text-dark-muted flex-shrink-0 truncate max-w-[80px]">{task.assigned_to}</span>
            )}
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-dark-muted hover:text-danger transition-opacity flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add task */}
      <form onSubmit={addTask} className="mt-3 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Legg til sjekkpunkt..."
          className="flex-1 text-sm"
        />
        <button
          type="submit"
          className="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-sm text-white/60 hover:text-gold hover:border-gold/30 transition-colors"
        >
          <Plus size={16} />
        </button>
      </form>

      {tasks.length === 0 && (
        <p className="text-dark-muted text-sm text-center py-6">
          Ingen sjekkpunkter ennå. Legg til det første over.
        </p>
      )}
    </div>
  );
}
