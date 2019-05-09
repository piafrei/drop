import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { Drop, DropService } from '../../services/drop.service';
import { AddDropPage } from '../add-drop/add-drop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
      DropService,
      AddDropPage
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
