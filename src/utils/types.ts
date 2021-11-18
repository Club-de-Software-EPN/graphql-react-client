export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export interface ToDo {
  id?: number;
  title: string;
  description: string;
  completed?: boolean;
  user?: User;
}

export type GetToDosInput = {
  userId: number;
}

export type GetUsersInput = {
  id: number;
}

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
}

export type CreateToDoInput = {
  title: string;
  description: string;
  userId: number;
}

export type MarkToDoCompletedInput = {
  id: number;
}