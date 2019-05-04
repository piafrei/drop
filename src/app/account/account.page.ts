import { Component, OnInit } from '@angular/core';
import { Drop, TodoService } from '../services/todo.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  allDrops: Drop[];
  myDrops: Drop[];

    constructor(private todoService: TodoService) { }

  ngOnInit() {
      this.todoService.getDrops().subscribe(res => {
          this.allDrops = res;
      });

      this.todoService.getMyDrops().subscribe(res => {
          this.myDrops = res;
      });
  }

  remove(item) {
      this.todoService.removeDrop(item.id);
  }
}
