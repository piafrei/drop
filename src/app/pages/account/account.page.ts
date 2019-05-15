import { Component, OnInit, ViewChild } from '@angular/core';
import { Drop, DropService } from '../../services/drop.service';
import { Events, IonSelect, NavController } from '@ionic/angular';


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

  constructor(private dropService: DropService, public navCtrl: NavController, public events: Events) { }

  ngOnInit() {
    this.dropService.getDrops().subscribe(res => {
          this.allDrops = res;
      });

    this.dropService.getMyDrops().subscribe(res => {
      this.myDrops = res;
    });
  }

  remove(item) {
    this.dropService.removeDrop(item.id);
  }

  showMore(item) {
    this.dropService.removeDrop(item.id);
  }
}
