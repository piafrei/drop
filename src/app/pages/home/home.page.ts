import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import leaflet from 'leaflet';
import { Drop } from '../../services/drop.service';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {FilterPage} from '../filter/filter.page';
import {MapService} from '../../services/map.service';
import {DropService} from '../../services/drop.service';

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
        private mapService: MapService,
        private dropService: DropService
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

        this.dropService.getLatestDropFromUser();
    }
    ionViewDidEnter() {
        this.mapService.getAndSaveUserData();
        HomePage.map = leaflet.map('map').fitWorld();
        HomePage.map = this.mapService.loadmap(HomePage.map);
    }
    centerMap() {
        this.mapService.backToCenter();
    }
}
