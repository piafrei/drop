import { Component, OnInit, ViewChild } from '@angular/core';
import { Drop, DropService } from '../../services/drop.service';
import { Events, IonSelect, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  allDrops: Drop[];
  myDrops: Drop[];

  @ViewChild('showSelect') selectRef: IonSelect;

  openSelect() {
    this.selectRef.open();
  }

  constructor(private dropService: DropService, public navCtrl: NavController, public events: Events, public alertController: AlertController) { }

  ngOnInit() {
    this.dropService.getDrops().subscribe(res => {
          this.allDrops = res;
      });

    this.dropService.getMyDrops().subscribe(res => {
      this.myDrops = res;
    });
  }

  showMore(item, event) {
    if (event.detail.value === 'delete') {
      this.confirmDelete(item);
    }
    /*if (event.detail.value === 'edit') {

    }*/
  }

  async confirmDelete(item) {
    const alert = await this.alertController.create({
      header: 'Löschen bestätigen',
      message: 'Soll dieser Drop wirklich gelöscht werden?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Löschen',
          handler: () => {
            this.dropService.removeDrop(item.id);
          }
        }
      ]
    });
    await alert.present();
  }
}
