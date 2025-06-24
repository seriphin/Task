export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  assignee?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  replies: Comment[];
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  assignee?: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateCommentData {
  content: string;
  parentId?: string;
}