import { Injectable } from '@angular/core';
import { Todo } from "src/models/todo.model";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageKey = 'todos';

  constructor() { }

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }

  getTodos(): Todo[] {
    const todos = localStorage.getItem(this.storageKey);
    return todos ? JSON.parse(todos) : [];
  }

  clearTodos(): void {
    localStorage.removeItem(this.storageKey);
  }
}