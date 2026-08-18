const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const buildUrl = (path) => `${API_BASE_URL}/api${path}`;

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to connect to task server.");
  }

  return data;
};

export const getTasks = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.completed !== undefined && params.completed !== "all") {
      queryParams.append("completed", params.completed);
    }
    if (params.priority && params.priority !== "all") {
      queryParams.append("priority", params.priority);
    }
    if (params.sort) queryParams.append("sort", params.sort);

    const response = await fetch(`${buildUrl("/tasks")}?${queryParams.toString()}`);
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await fetch(buildUrl(`/tasks/${id}`));
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await fetch(buildUrl("/tasks"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await fetch(buildUrl(`/tasks/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const toggleTaskComplete = async (id, completed) => {
  try {
    const response = await fetch(buildUrl(`/tasks/${id}/complete`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await fetch(buildUrl(`/tasks/${id}`), {
      method: "DELETE",
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const exportTasksToExcel = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.completed !== undefined && params.completed !== "all") {
      queryParams.append("completed", params.completed);
    }
    if (params.priority && params.priority !== "all") {
      queryParams.append("priority", params.priority);
    }

    const url = `${buildUrl("/tasks/export/excel")}?${queryParams.toString()}`;
    window.location.href = url;
  } catch (error) {
    console.error("Error exporting tasks to Excel:", error);
    throw error;
  }
};

export const exportTasksToPDF = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.completed !== undefined && params.completed !== "all") {
      queryParams.append("completed", params.completed);
    }
    if (params.priority && params.priority !== "all") {
      queryParams.append("priority", params.priority);
    }

    const url = `${buildUrl("/tasks/export/pdf")}?${queryParams.toString()}`;
    window.location.href = url;
  } catch (error) {
    console.error("Error exporting tasks to PDF:", error);
    throw error;
  }
};

