import { Drop, DropService } from '../../services/drop.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import {Device} from '@ionic-native/device/ngx';

@Component({
  selector: 'app-add-drop',
  templateUrl: './add-drop.page.html',
  styleUrls: ['./add-drop.page.scss'],
})
export class AddDropPage implements OnInit {
  dropId = null;
  latitude = 0;
  longitude = 0;

  drop: Drop = {
    createdAt: new Date().getTime(),
    description: '',
    latitude: this.getLatitude(),
    longitude: this.getLongitude(),
    score: 0,
    deviceID: this.getInfo(),
  };


  constructor(private route: ActivatedRoute, private nav: NavController, private dropService: DropService, private loadingController: LoadingController, private device: Device) {
  }

  getLatitude() {
    return this.latitude;
  }

  getLongitude() {
    return this.longitude;
  }

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
      message: 'Laden des Drops ...'
    });
    await loading.present();

    this.dropService.getDrop(this.dropId).subscribe(res => {
      loading.dismiss();
      this.drop = res;
    });
  }

  async saveDrop() {

    const loading = await this.loadingController.create({
      message: 'Speichern des Drops ...'
    });
    await loading.present();

    if (this.dropId) {
      this.dropService.updateDrop(this.drop, this.dropId).then(() => {
        loading.dismiss();
        this.nav.back();
      });
    } else {
      this.dropService.addDrop(this.drop).then(() => {
        loading.dismiss();
        this.nav.back();
      });
    }
  }
}
