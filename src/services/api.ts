// API service layer - connected to FastAPI backend

import { apiClient } from '@/lib/api-client';
import { Task, Project, CreateTaskData, UpdateTaskData, CreateProjectData, UpdateProjectData } from '@/lib/types';

// Backend response types
interface BackendTask {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  task_count: number;
  created_at: string;
}

// Transform backend task to frontend format
const transformTask = (backendTask: BackendTask): Task => ({
  id: backendTask.id,
  title: backendTask.title,
  description: backendTask.description || undefined,
  status: backendTask.status as Task['status'],
  priority: backendTask.priority as Task['priority'],
  projectId: backendTask.project_id,
  dueDate: backendTask.due_date ? new Date(backendTask.due_date) : undefined,
  createdAt: new Date(backendTask.created_at),
  updatedAt: new Date(backendTask.updated_at),
});

// Transform backend project to frontend format
const transformProject = (backendProject: BackendProject): Project => ({
  id: backendProject.id,
  name: backendProject.name,
  description: backendProject.description || undefined,
  color: backendProject.color,
  taskCount: backendProject.task_count,
  createdAt: new Date(backendProject.created_at),
});

// Project API
export const projectApi = {
  async getAll(): Promise<Project[]> {
    const projects = await apiClient.get<BackendProject[]>('/projects');
    return projects.map(transformProject);
  },

  async getById(id: string): Promise<Project | undefined> {
    try {
      const project = await apiClient.get<BackendProject>(`/projects/${id}`);
      return transformProject(project);
    } catch {
      return undefined;
    }
  },

  async create(data: CreateProjectData): Promise<Project> {
    const project = await apiClient.post<BackendProject>('/projects', data);
    return transformProject(project);
  },

  async update(id: string, data: UpdateProjectData): Promise<Project | undefined> {
    try {
      const project = await apiClient.put<BackendProject>(`/projects/${id}`, data);
      return transformProject(project);
    } catch {
      return undefined;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/projects/${id}`);
      return true;
    } catch {
      return false;
    }
  },
};

// Task API
export const taskApi = {
  async getAll(): Promise<Task[]> {
    const tasks = await apiClient.get<BackendTask[]>('/tasks');
    return tasks.map(transformTask);
  },

  async getByProject(projectId: string): Promise<Task[]> {
    const tasks = await apiClient.get<BackendTask[]>(`/projects/${projectId}/tasks`);
    return tasks.map(transformTask);
  },

  async getById(id: string): Promise<Task | undefined> {
    try {
      const tasks = await apiClient.get<BackendTask[]>('/tasks');
      const task = tasks.find(t => t.id === id);
      return task ? transformTask(task) : undefined;
    } catch {
      return undefined;
    }
  },

  async create(projectId: string, data: Omit<CreateTaskData, 'projectId'>): Promise<Task> {
    const backendTask = await apiClient.post<BackendTask>(`/projects/${projectId}/tasks`, {
      title: data.title,
      description: data.description || null,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      due_date: data.dueDate || null,
    });
    return transformTask(backendTask);
  },

  async update(id: string, data: UpdateTaskData): Promise<Task | undefined> {
    try {
      const backendTask = await apiClient.put<BackendTask>(`/tasks/${id}`, {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        due_date: data.dueDate,
      });
      return transformTask(backendTask);
    } catch {
      return undefined;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/tasks/${id}`);
      return true;
    } catch {
      return false;
    }
  },
};
