import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {FormBuilder, FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { Drop, DropService } from '../../services/drop.service';
import {AppComponent} from '../../app.component';
import { AddDropPage } from '../add-drop/add-drop.page';
import {UserService} from '../../services/user.service';
import {FilterPage} from '../filter/filter.page';
import {MapService} from '../../services/map.service';
// import { DropDetailPage } from '../drop-detail/drop-detail.page';

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
      AppComponent,
      AddDropPage,
      UserService,
      FilterPage,
      FormBuilder,
      MapService
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
