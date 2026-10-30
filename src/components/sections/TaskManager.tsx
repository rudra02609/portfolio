import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { useToast } from '../../context/ToastContext';
import {
  Task,
  AiInsight,
  getTasks,
  getAiInsight,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
} from '../../services/taskService';

const PAGE_SIZE = 6;
const PRIORITIES: Task['priority'][] = ['Low', 'Medium', 'High'];

const PRIORITY_STYLES: Record<Task['priority'], string> = {
  Low: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  Medium: 'text-amber-300 border-amber-400/30 bg-amber-400/10',
  High: 'text-red-300 border-red-400/30 bg-red-400/10',
};

export const TaskManager: React.FC = () => {
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'true' | 'false'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Task['priority']>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Low' as Task['priority'] });
  const [saving, setSaving] = useState(false);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [aiInsightOpen, setAiInsightOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Lock background scrolling when the AI Insight modal is open
  useEffect(() => {
    if (aiInsightOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [aiInsightOpen]);

  const loadTasks = useCallback(
    async (p = page) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTasks({
          page: p,
          limit: PAGE_SIZE,
          search: search || undefined,
          completed: statusFilter,
          priority: priorityFilter,
        });
        setTasks(res.tasks);
        setTotalPages(res.totalPages);
        setPage(res.page || p);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    },
    [page, search, statusFilter, priorityFilter]
  );

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) await loadTasks(1);
    })();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, priorityFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', priority: 'Low' });
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setForm({ title: task.title, description: task.description || '', priority: task.priority });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast('Please enter a task title.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateTask(editing.id, {
          title: form.title.trim(),
          description: form.description.trim(),
          priority: form.priority,
        });
        toast('Task updated.', 'success');
      } else {
        await createTask({
          title: form.title.trim(),
          description: form.description.trim(),
          priority: form.priority,
        });
        toast('Task created.', 'success');
      }
      setModalOpen(false);
      await loadTasks(editing ? page : 1);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Failed to save task.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await toggleTaskComplete(task.id, !task.completed);
      await loadTasks(page);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Failed to update task.', 'error');
    }
  };

  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    try {
      await deleteTask(task.id);
      toast('Task deleted.', 'success');
      const nextPage = tasks.length === 1 && page > 1 ? page - 1 : page;
      await loadTasks(nextPage);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Failed to delete task.', 'error');
    }
  };

  const handleAiInsight = async (taskId: string) => {
    if (aiLoading) return; // prevent duplicate requests while a request is in progress
    setAiInsight(null);
    setAiInsightOpen(true);
    setAiLoading(true);
    try {
      const insight = await getAiInsight(taskId);
      setAiInsight(insight);
    } catch (e: unknown) {
      setAiInsightOpen(false);
      toast(e instanceof Error ? e.message : 'AI Insight is temporarily unavailable. Please try again.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section
      id="tasks"
      className="relative z-[1] w-full py-20 sm:py-28 px-5 sm:px-8 md:px-10 section-border"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Task Manager"
          title="My Task Board"
          subtitle="Track my work items with full CRUD. Stores to the backend when available, otherwise falls back to your browser's local storage."
        />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search tasks…"
            className="portfolio-input flex-1 rounded-xl px-4 py-2.5 text-[14px]"
          />
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl px-5 py-2.5 text-[14px] bg-white text-black font-medium hover:bg-white/85 transition-colors cursor-pointer whitespace-nowrap"
          >
            + New Task
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 'true', 'false'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`rounded-full px-3.5 py-1.5 text-[12px] border transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-white text-black border-white'
                  : 'text-white/70 border-white/20 hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : s === 'true' ? 'Done' : 'Active'}
            </button>
          ))}
          {(['all', 'Low', 'Medium', 'High'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPriorityFilter(p);
                setPage(1);
              }}
              className={`rounded-full px-3.5 py-1.5 text-[12px] border transition-colors cursor-pointer ${
                priorityFilter === p
                  ? 'bg-white text-black border-white'
                  : 'text-white/70 border-white/20 hover:text-white'
              }`}
            >
              {p === 'all' ? 'Priority' : p}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-8 text-center text-red-300 text-[14px]">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-white/50 text-[15px] mb-2">No tasks found.</p>
            <p className="text-white/35 text-[13px]">Create your first task to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 sm:p-5 flex items-start gap-3"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(task)}
                  aria-label={task.completed ? 'Mark as active' : 'Mark as done'}
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                    task.completed
                      ? 'bg-emerald-400 border-emerald-400 text-black'
                      : 'border-white/40 hover:border-white'
                  }`}
                >
                  {task.completed && <span className="text-[12px] leading-none">✓</span>}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`text-[15px] sm:text-[16px] ${
                        task.completed ? 'line-through text-white/40' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${PRIORITY_STYLES[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-white/50 text-[13px] mt-1 line-clamp-2">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(task)}
                    className="text-white/50 hover:text-white text-[13px] transition-colors cursor-pointer"
                    aria-label="Edit task"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAiInsight(task.id)}
                    className="text-white/50 hover:text-white text-[13px] transition-colors cursor-pointer"
                    aria-label="AI Insight"
                  >
                    ✨ AI Insight
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(task)}
                    className="text-red-300/80 hover:text-red-300 text-[13px] transition-colors cursor-pointer"
                    aria-label="Delete task"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => loadTasks(page - 1)}
                  className="text-white/60 disabled:opacity-30 hover:text-white cursor-pointer disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <span className="text-[13px] text-white/50">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => loadTasks(page + 1)}
                  className="text-white/60 disabled:opacity-30 hover:text-white cursor-pointer disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center px-5"
          onClick={() => !saving && setModalOpen(false)}
        >
          <div
            className="glass rounded-3xl p-6 sm:p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-[20px] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
              {editing ? 'Edit Task' : 'New Task'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] text-white/50 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Task title"
                  className="portfolio-input w-full rounded-xl px-4 py-2.5 text-[14px]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[12px] text-white/50 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional details"
                  rows={3}
                  className="portfolio-input w-full rounded-xl px-4 py-2.5 text-[14px] resize-none"
                />
              </div>

              <div>
                <label className="block text-[12px] text-white/50 mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`flex-1 rounded-lg px-3 py-2 text-[13px] border transition-colors cursor-pointer ${
                        form.priority === p
                          ? 'bg-white text-black border-white'
                          : 'text-white/70 border-white/20 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => !saving && setModalOpen(false)}
                className="flex-1 rounded-xl px-4 py-2.5 text-[14px] border border-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 rounded-xl px-4 py-2.5 text-[14px] bg-white text-black font-medium hover:bg-white/85 transition-colors cursor-pointer disabled:opacity-60"
              >
                {saving ? 'Saving…' : editing ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    
    {/* AI Insight Modal */}
    {aiInsightOpen && (
      <div
        className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-sm flex items-center justify-center px-5"
        onClick={() => setAiInsightOpen(false)}
      >
        <div
          className="glass rounded-3xl p-6 sm:p-8 w-full max-w-md overflow-y-auto"
          style={{ maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto', overscrollBehavior: 'contain', marginTop: 'calc(1rem + 12px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3
            className="text-white text-[20px] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ✨ AI Insight
          </h3>
          
          {aiLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <span className="text-white/50 ml-3">Analyzing...</span>
            </div>
          ) : aiInsight ? (
            <div className="space-y-4">
              <p className="text-white/70 text-[13px]">{aiInsight.summary}</p>
              
              <h4 className="text-white/50 text-[13px] mb-2">How to Complete</h4>
              <ol className="list-decimal list-inside space-y-1">
                {(aiInsight.completionPlan || []).map((step, i) => (
                  <li
                    key={i}
                    className="text-white/70 text-[13px] leading-relaxed"
                  >
                    {step}
                  </li>
                ))}
              </ol>
              
              {aiInsight.completed && aiInsight.completed.length > 0 && (
                <div>
                  <h4 className="text-white/50 text-[13px] mb-2">Completed</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {aiInsight.completed.map((item, i) => (
                      <li key={i} className="text-white/70 text-[13px]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {aiInsight.remaining && aiInsight.remaining.length > 0 && (
                <div>
                  <h4 className="text-white/50 text-[13px] mb-2">Remaining</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {aiInsight.remaining.map((item, i) => (
                      <li key={i} className="text-white/70 text-[13px]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {aiInsight.blockers && aiInsight.blockers.length > 0 && (
                <div>
                  <h4 className="text-white/50 text-[13px] mb-2">Possible Blockers</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {aiInsight.blockers.map((item, i) => (
                      <li key={i} className="text-white/70 text-[13px]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="text-white/50 text-[13px] mb-2">Recommended Next Action</h4>
                <p className="text-white text-[14px] leading-relaxed">{aiInsight.recommendation}</p>
              </div>
            </div>
          ) : (
            <p className="text-white/60 text-[13px]">AI Insight is unavailable. Please try again.</p>
          )}
          
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setAiInsightOpen(false)}
              className="flex-1 rounded-xl px-4 py-2.5 text-[14px] border border-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    
    </section>
  );
};
