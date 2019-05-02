import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from '../services/todo.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  todos: Todo[];

  constructor(private todoService: TodoService) { }

  ngOnInit() {
      this.todoService.getTodos().subscribe(res => {
          this.todos = res;
      });
  }

  remove(item) {
        this.todoService.removeTodo(item.id);
  }

}
