import { Component, OnInit } from '@angular/core';
import { Drop, DropService } from '../../services/drop.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  allDrops: Drop[];
  myDrops: Drop[];

  constructor(private dropService: DropService) { }

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
}
