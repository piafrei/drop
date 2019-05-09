import { Drop, DropService } from '../../services/drop.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import {Device} from '@ionic-native/device/ngx';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-add-drop',
  templateUrl: './add-drop.page.html',
  styleUrls: ['./add-drop.page.scss'],
})
export class AddDropPage implements OnInit {
  dropId = null;

  constructor (
      private route: ActivatedRoute,
      private nav: NavController,
      private dropService: DropService,
      private loadingController: LoadingController,
      private device: Device,
      private appComponent: AppComponent,
  ) {}
  drop: Drop = {
    createdAt: new Date().getTime(),
    description: '',
    latitude: this.appComponent.latitude,
    longitude: this.appComponent.longitude,
    score: 0,
    deviceID: this.getInfo(),
  };

  ngOnInit() {
    this.dropId = this.route.snapshot.params['id'];
    if (this.dropId)  {
      this.loadDrop();
    }
  }

  getInfo() {
    return this.device.uuid;
  }

  async loadDrop() {
    const loading = await this.loadingController.create({
      message: 'Lädt...'
    });
    await loading.present();

    this.dropService.getDrop(this.dropId).subscribe(res => {
      loading.dismiss();
      this.drop = res;
    });
  }

  async saveDrop() {

    const loading = await this.loadingController.create({
      message: 'Speichern...'
    });
    await loading.present();

    if (this.dropId) {
      if (this.drop.score <= -10) {
      this.dropService.removeDrop(this.dropId);
      } else {
      this.dropService.updateDrop(this.drop, this.dropId).then(() => {
        loading.dismiss();
        this.nav.back();
      });
      }
    } else {
      this.dropService.addDrop(this.drop).then(() => {
        loading.dismiss();
        this.nav.back();
      });
    }
  }
}
