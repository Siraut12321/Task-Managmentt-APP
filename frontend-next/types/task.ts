export interface Task {
  _id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'inProgress' | 'completed';
  scheduled: boolean;
  dueDate?: string;
  completed: boolean;
  user: string;
  createdAt: string;
}
