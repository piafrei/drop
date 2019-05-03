import { Drop, TodoService } from '../../services/todo.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {

  todo: Drop = {
    createdAt: new Date().getTime(),
    description: '',
    coordinate: 0,
    score: 0
  };

  todoId = null;

  constructor(private route: ActivatedRoute, private nav: NavController, private todoService: TodoService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.todoId = this.route.snapshot.params['id'];
    if (this.todoId)  {
      this.loadDrop();
    }
  }

  async loadDrop() {
    const loading = await this.loadingController.create({
      message: 'Laden des Drops ...'
    });
    await loading.present();

    this.todoService.getDrop(this.todoId).subscribe(res => {
      loading.dismiss();
      this.todo = res;
    });
  }

  async saveTodo() {

    const loading = await this.loadingController.create({
      message: 'Speichern des Drops ...'
    });
    await loading.present();

    if (this.todoId) {
      this.todoService.updateDrop(this.todo, this.todoId).then(() => {
        loading.dismiss();
        this.nav.back();
      });
    } else {
      this.todoService.addDrop(this.todo).then(() => {
        loading.dismiss();
        this.nav.back();
      });
    }
  }

}
