"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MessageSquare,
  Kanban as KanbanIcon,
  Plus,
  Sparkles,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CardSkeleton, KanbanColumnSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

const COLUMNS = [
  { id: "TODO", title: "To Do", color: "#9CA3AF" },
  { id: "IN_PROGRESS", title: "In Progress", color: "#635BFF" },
  { id: "REVIEW", title: "In Review", color: "#F59E0B" },
  { id: "DONE", title: "Completed", color: "#10B981" },
];

function SortableTaskCard({ task }: { task: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityVariant =
    task.priority === "URGENT"
      ? "danger"
      : task.priority === "HIGH"
      ? "warning"
      : task.priority === "MEDIUM"
      ? "purple"
      : "default";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-3"
    >
      <div className="flex items-center justify-between">
        <Badge variant={priorityVariant} size="sm">
          {task.priority}
        </Badge>
        {task.project && (
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {task.project.key || "PROJ"}
          </span>
        )}
      </div>

      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{task.title}</h4>

      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{task.comments?.length || 0}</span>
          </span>
        </div>

        {task.assignee && <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size="sm" />}
      </div>
    </div>
  );
}

function KanbanColumn({ col, tasks, children }: { col: any; tasks: any[]; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-[22px] border transition-all duration-200 min-h-[600px] flex flex-col ${
        isOver
          ? "kanban-col-bg-over bg-[#E0F2FE]/40 border-[#38BDF8] ring-2 ring-[#38BDF8]/20 shadow-md"
          : "kanban-col-bg bg-slate-100/70 border-slate-200/80"
      }`}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }} />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{col.title}</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 text-xs font-bold shadow-sm">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        id={col.id}
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3">
          {tasks.length === 0 ? (
            <div className="h-44 border-2 border-dashed border-slate-300/70 dark:border-slate-700/60 rounded-[18px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
              <span className="font-medium">Empty Step</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Drop task card here</span>
            </div>
          ) : (
            children
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Task state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    loadKanbanTasks();
  }, []);

  const loadKanbanTasks = async () => {
    setIsLoading(true);
    try {
      const wsRes = await fetch("/api/workspaces");
      if (wsRes.ok) {
        const wsData = await wsRes.json();
        const activeWs = wsData.workspaces?.[0];
        setWorkspace(activeWs);

        if (activeWs) {
          const [tRes, pRes, mRes] = await Promise.all([
            fetch(`/api/tasks?workspaceId=${activeWs.id}`),
            fetch(`/api/projects?workspaceId=${activeWs.id}`),
            fetch(`/api/workspaces/${activeWs.id}/members`),
          ]);

          if (tRes.ok) {
            const tData = await tRes.json();
            setTasks(tData.tasks || []);
          }
          if (pRes.ok) {
            const pData = await pRes.json();
            setProjects(pData.projects || []);
            if (pData.projects?.length > 0) setProjectId(pData.projects[0].id);
          }
          if (mRes.ok) {
            const mData = await mRes.json();
            setMembers(mData.members || []);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoGenerateDesc = async () => {
    if (!title.trim()) return;
    setIsGeneratingDesc(true);

    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type: "task" }),
      });

      const data = await res.json();
      if (res.ok && data.description) {
        setDescription(data.description);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !projectId || !title) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: workspace.id,
          projectId,
          title,
          description,
          priority,
          status,
          assigneeId: assigneeId || null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        loadKanbanTasks();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const draggedTask = tasks.find((t) => t.id === activeId);
    if (!draggedTask) return;

    let newStatus = COLUMNS.some((c) => c.id === overId)
      ? overId
      : tasks.find((t) => t.id === overId)?.status;

    if (!newStatus || newStatus === draggedTask.status) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: activeId,
          workspaceId: workspace.id,
          status: newStatus,
        }),
      });
    } catch (e) {
      console.error("Failed to persist task status change", e);
      loadKanbanTasks();
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <KanbanIcon className="w-6 h-6 text-[#635BFF]" />
              <span>Interactive Kanban Board</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Drag and drop cards into any step, including empty columns
            </p>
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
            Split Work & Add Task
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KanbanColumnSkeleton />
            <KanbanColumnSkeleton />
            <KanbanColumnSkeleton />
            <KanbanColumnSkeleton />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              {COLUMNS.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col.id);

                return (
                  <KanbanColumn key={col.id} col={col} tasks={columnTasks}>
                    {columnTasks.map((task) => (
                      <SortableTaskCard key={task.id} task={task} />
                    ))}
                  </KanbanColumn>
                );
              })}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="p-4 rounded-[16px] bg-white border-2 border-[#635BFF] shadow-2xl scale-105 opacity-90">
                  <Badge variant="purple" size="sm">
                    {activeTask.priority}
                  </Badge>
                  <h4 className="font-bold text-gray-900 text-sm mt-2">{activeTask.title}</h4>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* Task Creation & Team Assignment Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Split Work into Task"
          subtitle="Assign work deliverables to project team members"
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <Input
              label="Task Title / Deliverable"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build Auth API endpoint"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase">Target Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-gray-100/80 border border-transparent rounded-[12px] p-3 text-sm focus:bg-white focus:border-[#635BFF] outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.key})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase">Assignee</label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full bg-gray-100/80 border border-transparent rounded-[12px] p-3 text-sm focus:bg-white focus:border-[#635BFF] outline-none"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.user.id} value={m.user.id}>
                      {m.user.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-gray-100/80 border border-transparent rounded-[12px] p-3 text-sm focus:bg-white focus:border-[#635BFF] outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 uppercase">Description / Notes</label>
                <button
                  type="button"
                  onClick={handleAutoGenerateDesc}
                  disabled={!title.trim() || isGeneratingDesc}
                  className="text-[11px] font-bold text-[#635BFF] hover:underline flex items-center gap-1 disabled:opacity-40 disabled:no-underline cursor-pointer"
                >
                  {isGeneratingDesc ? (
                    <Loader2 className="w-3 h-3 animate-spin text-[#635BFF]" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-[#635BFF]" />
                  )}
                  <span>Auto-Generate Description</span>
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details or deliverables..."
                className="w-full bg-gray-100/80 border border-transparent rounded-[12px] p-3 text-sm focus:bg-white focus:border-[#635BFF] outline-none"
                rows={3}
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Create & Assign Task
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
