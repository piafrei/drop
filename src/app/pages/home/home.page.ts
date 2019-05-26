import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Geolib from 'geolib';

import leaflet from 'leaflet';
import { NavController } from '@ionic/angular';
import { Drop, DropService } from '../../services/drop.service';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController } from '@ionic/angular';
import {FilterPage} from '../filter/filter.page';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    constructor(
        private router: Router,
        private statusBar: StatusBar,
        public filter: FilterPage,
        private mapService: MapService
    ) {}

    public static map: any;
    public static markersArray = [];
    public static activeFilters = [];
    @ViewChild('map') public static mapContainer: ElementRef;

    myDrops: Drop[];

    ngOnInit() {
        // let status bar overlay webview
        this.statusBar.overlaysWebView(true);

        // set status bar to white
        this.statusBar.backgroundColorByHexString('#7633FF');
    }
    ionViewDidEnter() {
        this.mapService.getAndSaveUserData();
        HomePage.map = leaflet.map('map').fitWorld();
        HomePage.map = this.mapService.loadmap(HomePage.map);
    }
}
