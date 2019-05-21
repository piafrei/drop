import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as Geolib from 'geolib';

import leaflet from 'leaflet';
import {NavController} from '@ionic/angular';
import {Drop, DropService} from '../../services/drop.service';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    myDrops: Drop[];

    @ViewChild('map') mapContainer: ElementRef;

    map: any;

    constructor(
        private router: Router,
        public navCtrl: NavController,
        public dropService: DropService,
        public appComponent: AppComponent,
        public userService: UserService,
        private statusBar: StatusBar
    ) {}
    ngOnInit() {
        // let status bar overlay webview
        this.statusBar.overlaysWebView(true);

        // set status bar to white
        this.statusBar.backgroundColorByHexString('#8633FF');
    }
    ionViewDidEnter() {
        this.loadmap();
    }
    loadmap() {
        const positionIcon = leaflet.icon({
            iconUrl: '../../../assets/icon/position.png',
            shadowUrl: '../../../assets/icon/position-shadow.svg',

            iconSize: [30, 30], // size of the icon
            shadowSize: [30, 30], // size of the shadow
            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            shadowAnchor: [2, -2], // the same for the shadow
            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        this.map = leaflet.map('map').fitWorld();
        leaflet.tileLayer(
            'https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=JrASdfPCkNw3CYBKAD6E',
            {
            attributions:
            'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            minZoom: 15
            }
        )
        .addTo(this.map);
        this.map.locate({
            setView: true,
            maxZoom: 10,
            minZoom: 15
        })
        .on('locationfound', e => {
            const markerGroup = leaflet.featureGroup();
            const marker: any = leaflet
            .marker([e.latitude, e.longitude], {
                icon: positionIcon,
                zIndexOffset: -1000 // put the markers on top of the location marker
            })
            .on('click', () => {
                console.log('Position marker clicked');
            });
            markerGroup.addLayer(marker);
            this.map.addLayer(markerGroup);
        })
        .on('locationerror', err => {
            console.log(err.message);
        });
        this.loadMarkers();
    }
    loadMarkers() {
        const greyDropIcon = leaflet.icon({
            iconUrl: '../../../assets/icon/grey-drop.png',
            shadowUrl: '../../../assets/icon/drop-shadow.svg',

            iconSize: [25, 30], // size of the icon
            shadowSize: [25, 30], // size of the shadow
            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            shadowAnchor: [2, -2], // the same for the shadow
            popupAnchor: [-3, -5] // point from which the popup should open relative to the iconAnchor
        });
        const KingDropIcon = leaflet.icon({
            iconUrl: '../../../assets/icon/colored-kingdrop.png',
            shadowUrl: '../../../assets/icon/drop-shadow.svg',

      iconSize: [25, 30], // size of the icon
      shadowSize: [25, 30], // size of the shadow
      iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [2, -2], // the same for the shadow
      popupAnchor: [-3, -5] // point from which the popup should open relative to the iconAnchor
    });
    const user = this.userService.getUser();
    let userData;
    let visibleDropsUser;
    user.subscribe(val => {
       userData = val.data();
       visibleDropsUser = userData.visibleDrops;
    });
    setTimeout(function() {
      console.log('Timeout triggered');
    },  750);
    this.dropService.getDrops().subscribe((drops: any) => {
      drops.forEach(singledrop => {
        if (this.dropService.isDropVisible(singledrop)) {
            const dropGroup = leaflet.featureGroup();
            if (visibleDropsUser.indexOf(singledrop.dropID) > -1) {
                this.setDropVisible(singledrop);
            }
            const dist = this.checkDropDistance(singledrop);
            if (dist < 1500 && singledrop.score > -10) {
                this.userService.saveDropToVisibleDrops(singledrop.dropID);
                this.setDropVisible(singledrop);
            } else if (singledrop.score > -10) {
                const drop: any = leaflet
                    .marker([singledrop.latitude, singledrop.longitude], {
                        icon: greyDropIcon
                    })
                    .on('click', () => {
                        console.log('Marker clicked, but out of range');
                    });
                dropGroup.addLayer(drop);
                this.map.addLayer(dropGroup);
            }
        }
      });
    });
  }
  checkDropDistance(drop) {
    const dist = Geolib.getDistance(
      {
        latitude: this.appComponent.latitude,
        longitude: this.appComponent.longitude
      },
      { latitude: drop.latitude, longitude: drop.longitude }
    );
    console.log(dist);
    return dist;
  }
  setDropVisible(drop) {
    this.addVisibleDropToMap(drop);
  }
  addVisibleDropToMap(dropParam) {
    const coloredDropIcon = leaflet.icon({
      iconUrl: '../../../assets/icon/faded-drop.png',
      shadowUrl: '../../../assets/icon/drop-shadow.svg',

            iconSize: [25, 30], // size of the icon
            shadowSize: [25, 30], // size of the shadow
            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            shadowAnchor: [2, -2], // the same for the shadow
            popupAnchor: [-3, -5] // point from which the popup should open relative to the iconAnchor
        });
        const dropGroup = leaflet.featureGroup();
        const drop: any = leaflet
        .marker([dropParam.latitude, dropParam.longitude], {
            icon: coloredDropIcon
        })
        .on('click', () => {
            const id = dropParam.id;
            const url = 'drop/';
            const dropUrl = url.concat(id);
            this.router.navigateByUrl(dropUrl);
        });
        dropGroup.addLayer(drop);
        this.map.addLayer(dropGroup);
    }
}
