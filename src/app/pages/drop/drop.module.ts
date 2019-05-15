import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DropPage } from './drop.page';
import { Device } from '@ionic-native/device/ngx';
import { AppComponent } from '../../app.component';

const routes: Routes = [
  {
    path: '',
    component: DropPage
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
    Device,
    AppComponent
  ],
  declarations: [DropPage]
})
export class DropPageModule {}
