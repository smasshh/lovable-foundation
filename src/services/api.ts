// API service layer - ready for backend integration
// Currently uses mock data, can be connected to Lovable Cloud later

import { Task, Project, TaskStatus, TaskPriority } from '@/lib/types';
import { generateId } from '@/lib/utils';

// Simulated API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// Mock data store (will be replaced with actual API calls)
let mockTasks: Task[] = [
  {
    id: generateId(),
    title: 'Design system documentation',
    description: 'Create comprehensive documentation for the design system components',
    status: 'in-progress',
    priority: 'high',
    projectId: '1',
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'API integration layer',
    description: 'Build the service layer for backend communication',
    status: 'todo',
    priority: 'high',
    projectId: '1',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'User authentication flow',
    description: 'Implement login, signup, and password reset',
    status: 'todo',
    priority: 'medium',
    projectId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Dashboard analytics',
    description: 'Add charts and statistics to the dashboard',
    status: 'done',
    priority: 'low',
    projectId: '2',
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000),
  },
];

let mockProjects: Project[] = [
  {
    id: '1',
    name: 'Task Manager',
    description: 'Building the ultimate task management app',
    color: '#3B82F6',
    taskCount: 3,
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: '2',
    name: 'Marketing Site',
    description: 'Company marketing website redesign',
    color: '#10B981',
    taskCount: 1,
    createdAt: new Date(Date.now() - 86400000 * 14),
  },
];

// Task API
export const taskApi = {
  async getAll(): Promise<Task[]> {
    await simulateDelay();
    return [...mockTasks];
  },

  async getByProject(projectId: string): Promise<Task[]> {
    await simulateDelay();
    return mockTasks.filter(t => t.projectId === projectId);
  },

  async getById(id: string): Promise<Task | undefined> {
    await simulateDelay();
    return mockTasks.find(t => t.id === id);
  },

  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await simulateDelay();
    const task: Task = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTasks.push(task);
    return task;
  },

  async update(id: string, data: Partial<Task>): Promise<Task | undefined> {
    await simulateDelay();
    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    mockTasks[index] = {
      ...mockTasks[index],
      ...data,
      updatedAt: new Date(),
    };
    return mockTasks[index];
  },

  async delete(id: string): Promise<boolean> {
    await simulateDelay();
    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    mockTasks.splice(index, 1);
    return true;
  },
};

// Project API
export const projectApi = {
  async getAll(): Promise<Project[]> {
    await simulateDelay();
    return [...mockProjects];
  },

  async getById(id: string): Promise<Project | undefined> {
    await simulateDelay();
    return mockProjects.find(p => p.id === id);
  },

  async create(data: Omit<Project, 'id' | 'taskCount' | 'createdAt'>): Promise<Project> {
    await simulateDelay();
    const project: Project = {
      ...data,
      id: generateId(),
      taskCount: 0,
      createdAt: new Date(),
    };
    mockProjects.push(project);
    return project;
  },
};
