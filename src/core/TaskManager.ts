import { Task, TaskStatus, TaskPriority } from '../types/task.js';
import { logger } from '../utils/logger.js';

export class TaskManager {
  private tasks: Map<string, Task>;

  constructor() {
    this.tasks = new Map();
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null
    };

    this.tasks.set(newTask.id, newTask);
    logger.info(`Task created: ${newTask.id}`);
    return newTask;
  }

  updateTaskStatus(taskId: string, status: TaskStatus): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    task.status = status;
    task.updatedAt = new Date();
    if (status === TaskStatus.COMPLETED) {
      task.completedAt = new Date();
    }

    this.tasks.set(taskId, task);
    logger.info(`Task ${taskId} status updated to ${status}`);
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return Array.from(this.tasks.values())
      .filter(task => task.status === status);
  }

  getTasksByPriority(priority: TaskPriority): Task[] {
    return Array.from(this.tasks.values())
      .filter(task => task.priority === priority);
  }
}