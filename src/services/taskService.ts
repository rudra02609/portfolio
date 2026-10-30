const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STORAGE_KEY = "portfolio_tasks_local";

// Backend availability is probed once per session. When the backend is
// unreachable we transparently fall back to localStorage so the UI never breaks.
const backendAvailable = { value: false, probed: false };

const buildUrl = (path: string) => `${API_BASE_URL}/api${path}`;

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Unable to connect to task server.");
  return data;
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AiInsight {
  summary: string;
  completionPlan: string[];
  completed: string[];
  remaining: string[];
  blockers: string[];
  recommendation: string;
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  completed?: string | boolean;
  priority?: string;
  sort?: string;
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ---- Local fallback helpers -------------------------------------------------

const readLocal = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
};

const writeLocal = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const toTask = (t: Task): Task => ({
  id: t.id,
  title: t.title,
  description: t.description || "",
  completed: t.completed,
  priority: t.priority,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});

// ---- Probe backend ----------------------------------------------------------

async function probeBackend(): Promise<boolean> {
  if (backendAvailable.probed) return backendAvailable.value;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${buildUrl("/health")}`, { signal: controller.signal });
    clearTimeout(timer);
    backendAvailable.value = res.ok;
    // Also verify we can create a task by checking the response status
    backendAvailable.value = backendAvailable.value && res.status === 200;
  } catch {
    backendAvailable.value = false;
  }
  backendAvailable.probed = true;
  return backendAvailable.value;
}

// ---- Public API -------------------------------------------------------------

export const getTasks = async (params: GetTasksParams = {}): Promise<TasksResponse> => {
  if (await probeBackend()) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", String(params.page));
    if (params.limit) queryParams.append("limit", String(params.limit));
    if (params.search) queryParams.append("search", params.search);
    if (params.completed !== undefined && params.completed !== "all") {
      queryParams.append("completed", String(params.completed));
    }
    if (params.priority && params.priority !== "all") {
      queryParams.append("priority", params.priority);
    }
    if (params.sort) queryParams.append("sort", params.sort);

    const response = await fetch(`${buildUrl("/tasks")}?${queryParams.toString()}`, {
      headers: getAuthHeader(),
    });
    const data = await handleResponse(response);
    return {
      ...data,
      tasks: ((data.tasks as RawTask[]) || []).map(normalizeTask),
      total: data.total ?? 0,
    };
  }

  // Local fallback
  const page = params.page || 1;
  const limit = params.limit || 6;
  let tasks = readLocal();

  if (params.search) {
    const q = params.search.toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  }
  if (params.completed !== undefined && params.completed !== "all") {
    const val = String(params.completed) === "true";
    tasks = tasks.filter((t) => t.completed === val);
  }
  if (params.priority && params.priority !== "all") {
    tasks = tasks.filter((t) => t.priority === params.priority);
  }
  tasks = [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = tasks.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const slice = tasks.slice((page - 1) * limit, page * limit);
  return { tasks: slice, total, page, totalPages };
};

// Track in-flight AI Insight requests by taskId to prevent duplicates
const aiInsightControllers = new Map<string, AbortController>();

export const getAiInsight = async (taskId: string): Promise<AiInsight> => {
  if (!taskId) throw new Error("Task id is missing.");
  if (!(await probeBackend())) {
    throw new Error("AI Insight requires the backend server. Please start it and try again.");
  }

  // Abort any in-flight request for the same task to prevent duplicates
  const existing = aiInsightControllers.get(taskId);
  if (existing) {
    existing.abort();
  }
  const controller = new AbortController();
  aiInsightControllers.set(taskId, controller);

  let response: Response;
  try {
    response = await fetch(buildUrl(`/tasks/${taskId}/ai-insight`), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      signal: controller.signal,
    });

    // If the request was aborted (duplicate click), throw a specific error
    if (response.status === 499) {
      throw new Error("AI Insight request cancelled (duplicate click prevented).");
    }
  } finally {
    aiInsightControllers.delete(taskId);
  }

  const data = await handleResponse(response);
  if (!data || !data.success || !data.insight) {
    throw new Error(data?.message || "AI Insight failed.");
  }
  return data.insight as AiInsight;
};

export const getTaskById = async (id: string): Promise<{ task: Task }> => {
  if (!id) throw new Error("Task id is missing.");
  if (await probeBackend()) {
    const response = await fetch(buildUrl(`/tasks/${id}`), { headers: getAuthHeader() });
    const data = await handleResponse(response);
    return { task: normalizeTask(data.task) };
  }
  const task = readLocal().find((t) => t.id === id);
  if (!task) throw new Error("Task not found.");
  return { task: normalizeTask(task) };
};

export interface RawTask {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  priority?: string;
  createdAt?: string;
  updatedAt?: string;
}

const normalizeTask = (t: RawTask): Task => {
  const id = t._id ?? t.id ?? "";
  return {
    id,
    title: t.title,
    description: t.description || "",
    completed: !!t.completed,
    priority: (t.priority as Task["priority"]) || "Low",
    createdAt: t.createdAt || "",
    updatedAt: t.updatedAt || "",
  };
};

export const createTask = async (taskData: {
  title: string;
  description?: string;
  priority?: string;
}): Promise<{ task: Task }> => {
  if (await probeBackend()) {
    const response = await fetch(buildUrl("/tasks"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(taskData),
    });
    const data = await handleResponse(response);
    return { task: normalizeTask(data.task) };
  }
  // Local fallback: create task in browser localStorage
  const now = new Date().toISOString();
  const task: Task = {
    id: uid(),
    title: taskData.title,
    description: taskData.description || "",
    completed: false,
    priority: (taskData.priority as Task["priority"]) || "Low",
    createdAt: now,
    updatedAt: now,
  };
  const tasks = [task, ...readLocal()];
  writeLocal(tasks);
  return { task };
};

export const updateTask = async (
  id: string,
  taskData: { title?: string; description?: string; priority?: string }
): Promise<{ task: Task }> => {
  if (!id) throw new Error("Task id is missing.");
  if (await probeBackend()) {
    const response = await fetch(buildUrl(`/tasks/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(taskData),
    });
    const data = await handleResponse(response);
    return { task: normalizeTask(data.task) };
  }
  // Local fallback
  const tasks = readLocal();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Task not found.");
  tasks[idx] = {
    ...tasks[idx],
    ...taskData,
    priority: (taskData.priority as Task["priority"]) || tasks[idx].priority,
    updatedAt: new Date().toISOString(),
  };
  writeLocal(tasks);
  return { task: normalizeTask(tasks[idx]) };
};

export const toggleTaskComplete = async (id: string, completed: boolean): Promise<{ task: Task }> => {
  if (!id) throw new Error("Task id is missing.");
  if (await probeBackend()) {
    const response = await fetch(buildUrl(`/tasks/${id}/complete`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ completed }),
    });
    return handleResponse(response);
  }
  // Local fallback
  const tasks = readLocal();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Task not found.");
  tasks[idx] = { ...tasks[idx], completed, updatedAt: new Date().toISOString() };
  writeLocal(tasks);
  return { task: normalizeTask(tasks[idx]) };
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  if (!id) throw new Error("Task id is missing.");
  if (await probeBackend()) {
    const response = await fetch(buildUrl(`/tasks/${id}`), {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  }
  // Local fallback
  writeLocal(readLocal().filter((t) => t.id !== id));
  return { message: "Task deleted." };
};