import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {IonicModule, NavController} from '@ionic/angular';

import { FilterPage } from './filter.page';
import {HomePage} from '../home/home.page';
import {AppComponent} from '../../app.component';
import {DropService} from '../../services/drop.service';

const routes: Routes = [
  {
    path: '',
    component: FilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    HomePage,
    DropService,
    FormBuilder,
    AppComponent,
    NavController
  ],
  declarations: [FilterPage]
})
export class FilterPageModule {}
