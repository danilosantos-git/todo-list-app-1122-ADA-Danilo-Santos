import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Guid } from "guid-typescript";
import { Todo } from "src/models/todo.model";
import { StorageService } from "./services/storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  todos: Todo[] = [];
  editingId: Guid | null = null;
  editingTitle: string = '';

  constructor(private storageService: StorageService) { };

  ngOnInit() {
    this.todos = this.storageService.getTodos();
  }

  onSubmit(form: NgForm) {
    if (form.value.title !== null && form.value.title.trim() !== '') {
      const todo = new Todo(Guid.create(), form.value.title, false);
      this.todos.push(todo);
      this.storageService.saveTodos(this.todos);
      form.resetForm();
    }
  }

  onComplete(id: Guid) {
    const todo = this.todos.filter(x => x.id === id)[0];
    const isConfirmed = confirm(`Deseja marcar "${todo.title}" como concluída?`);
    if (isConfirmed) {
      todo.isComplete = true;
      this.storageService.saveTodos(this.todos);
      alert(`"${todo.title}" foi concluída com sucesso!`);
    }
  }

  onDelete(id: Guid) {
    const todo = this.todos.filter(x => x.id === id)[0];

    if (!todo.isComplete) {
      const isConfirmed = confirm(`Excluir "${todo.title}"?`);
      if (isConfirmed) {
        this.deleteTask(todo);
      }
    } else {

      this.deleteTask(todo);
    }
  }

  deleteTask(todo: Todo) {
    const index = this.todos.indexOf(todo, 0);
    if (index > -1) {
      this.todos.splice(index, 1);
    }
    this.storageService.saveTodos(this.todos);
  }

  onEdit(id: Guid, newTitle: string) {
    const todo = this.todos.find(x => x.id.toString() === id.toString());
    if (todo) {
      todo.title = newTitle;
      this.storageService.saveTodos(this.todos);
    }
  }

  startEdit(todo: Todo) {
    this.editingId = todo.id;
    this.editingTitle = todo.title;
  }

  saveEdit(todo: Todo) {
    if (this.editingId) {
      this.onEdit(this.editingId, this.editingTitle);
      this.editingId = null;
      this.editingTitle = '';
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editingTitle = '';
  }
}