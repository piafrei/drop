import { Component, OnInit } from '@angular/core';
import { Drop, TodoService } from '../services/todo.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  todos: Drop[];

  constructor(private todoService: TodoService) { }

  ngOnInit() {
      this.todoService.getDrops().subscribe(res => {
          this.todos = res;
      });
  }

  remove(item) {
        this.todoService.removeDrop(item.id);
  }

}
