import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Drop, DropService } from '../../services/drop.service';
import { Device } from '@ionic-native/device/ngx';
import { AppComponent } from '../../app.component';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-drop',
  templateUrl: './drop.page.html',
  styleUrls: ['./drop.page.scss']
})
export class DropPage implements OnInit {
  dropId = null;

  constructor(
    private route: ActivatedRoute,
    private nav: NavController,
    private dropService: DropService,
    private loadingController: LoadingController,
    private device: Device,
    private appComponent: AppComponent,
    private http: HttpClient,
    public alertController: AlertController
  ) {}
  drop: Drop = {
    createdAt: new Date().getTime(),
    description: '',
    category: '',
    latitude: this.appComponent.latitude,
    longitude: this.appComponent.longitude,
    score: 0,
    deviceID: this.getInfo(),
    dropID: 0,
    votedBy: []
  };

  ngOnInit() {
    this.dropId = this.route.snapshot.params['id'];
    if (this.dropId) {
      this.loadDrop();
    }
  }

  getInfo() {
    var deviceId = this.device.uuid
    if (deviceId == null){
      deviceId = "DESKTOP";
    }
    return deviceId;
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
  voteUp(score, votedBy) {
    let allowedtovote = true;
    let currentUuid = this.device.uuid;
    votedBy.forEach(function(uuid) {
      console.log(uuid);
      if (uuid === currentUuid) {
        console.log('bereits gevoted');
        allowedtovote = false;
      }
    });

    if (allowedtovote === true) {
      this.drop.score = score + 1;
      console.log('new score: ' + score);
      this.drop.votedBy.push(currentUuid);
      this.dropService.updateDrop(this.drop, this.dropId);
    }
  }

  voteDown(score, votedBy) {
    let allowedtovote = true;
    let currentUuid = this.device.uuid;
    votedBy.forEach(function(uuid) {
      console.log(uuid);
      if (uuid === currentUuid) {
        console.log('bereits gevoted');
        allowedtovote = false;
      }
    });

    if (allowedtovote === true) {
      this.drop.score = score - 1;
      console.log('new score: ' + score);
      this.drop.votedBy.push(currentUuid);
      this.dropService.updateDrop(this.drop, this.dropId);
    }
  }
  selectedOption(drop, event){
      if (event.detail.value === 'report') {
          const baseUrl = 'https://us-central1-dropdb-55efa.cloudfunctions.net';
          const url = baseUrl.concat("/sendMail?dest=reportdropapp@gmail.com&dropId=",drop.dropID, "&reporterId=", this.getInfo(),"&dropDescription=",drop.description,"&userId=",drop.deviceId);
          console.log(drop.dropID, drop.deviceId, this.getInfo());
          this.presentAlert();
          return this.http.get(url, {observe: 'response'})
              .subscribe(response => {

                  // You can access status:
                  console.log(response.status);

                  // Or any other header:
                  console.log(response.headers.get('X-Custom-Header'));
              });
      }
  }
    async presentAlert() {
        const alert = await this.alertController.create({
            header: 'Drop wurde gemeldet',
            message: 'Wir kümmern uns so schnell wie möglich darum, den Drop zu überprüfen.',
            buttons: ['OK']
        });

        await alert.present();
    }

}
