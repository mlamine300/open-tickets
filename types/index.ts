export interface User {
  _id?: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  password?: string;
  role?: string;
  token?: string;
  createdAt?: Date;
}

export type priorityLevel = "Low" | "Medium" | "High";
export type statusType = "Pending" | "In Progress" | "Completed";

export interface TaskLine {
  _id: string;
  status: statusType;
  title: string;
  priority: priorityLevel;
  createdAt: Date;
}
export interface TodoType {
  text: string;
  completed?: boolean | true;
}
export interface Task {
  _id?: string;
  title: string;
  description: string;
  priority?: "Low" | "Medium" | "High";
  status?: "Pending" | "In Progress" | "Completed";
  dueDate: Date;
  assignedTo: User[];
  createdBy?: string;
  attachments?: string[];
  todoChecklist: TodoType[];
  progress?: number;
}
