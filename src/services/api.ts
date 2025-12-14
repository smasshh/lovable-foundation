// API service layer - connected to FastAPI backend

import { apiClient } from '@/lib/api-client';
import { Task, Project } from '@/lib/types';

// Backend task response type (matches Pydantic schema)
interface BackendTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
}

// Transform backend task to frontend format
const transformTask = (backendTask: BackendTask): Task => ({
  id: backendTask.id,
  title: backendTask.title,
  description: backendTask.description || undefined,
  status: backendTask.status as Task['status'],
  priority: 'medium', // Default priority since backend doesn't have it yet
  projectId: '', // Not used in current backend
  createdAt: new Date(backendTask.created_at),
  updatedAt: new Date(backendTask.created_at),
});

// Task API - connected to FastAPI backend
export const taskApi = {
  async getAll(): Promise<Task[]> {
    const tasks = await apiClient.get<BackendTask[]>('/tasks');
    return tasks.map(transformTask);
  },

  async getByProject(projectId: string): Promise<Task[]> {
    // Backend doesn't have projects yet, return all tasks
    const tasks = await apiClient.get<BackendTask[]>('/tasks');
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

  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const backendTask = await apiClient.post<BackendTask>('/tasks', {
      title: data.title,
      description: data.description || null,
      status: data.status || 'todo',
    });
    return transformTask(backendTask);
  },

  async update(id: string, data: Partial<Task>): Promise<Task | undefined> {
    try {
      const backendTask = await apiClient.put<BackendTask>(`/tasks/${id}`, {
        title: data.title,
        description: data.description,
        status: data.status,
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

// Project API - mock for now (can be extended later)
let mockProjects: Project[] = [
  {
    id: '1',
    name: 'Default Project',
    description: 'Your default project',
    color: '#3B82F6',
    taskCount: 0,
    createdAt: new Date(),
  },
];

export const projectApi = {
  async getAll(): Promise<Project[]> {
    return [...mockProjects];
  },

  async getById(id: string): Promise<Project | undefined> {
    return mockProjects.find(p => p.id === id);
  },

  async create(data: Omit<Project, 'id' | 'taskCount' | 'createdAt'>): Promise<Project> {
    const project: Project = {
      ...data,
      id: crypto.randomUUID(),
      taskCount: 0,
      createdAt: new Date(),
    };
    mockProjects.push(project);
    return project;
  },
};
