import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TodoDetailsPage } from './todo-details.page';
import {Device} from '@ionic-native/device/ngx';

const routes: Routes = [
  {
    path: '',
    component: TodoDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
    providers: [
        Device
    ],
  declarations: [TodoDetailsPage]
})
export class TodoDetailsPageModule {}
