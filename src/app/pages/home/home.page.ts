import { Component, ViewChild, ElementRef } from '@angular/core';
import * as Geolib from 'geolib';

import leaflet from 'leaflet';
import { NavController } from '@ionic/angular';
import { Drop, DropService } from '../../services/drop.service';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
// import { AddDropPage } from '../add-drop/add-drop.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  constructor(
    private router: Router,
    public navCtrl: NavController,
    public dropService: DropService,
    public appComponent: AppComponent
  ) {}
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
    leaflet
      .tileLayer(
        'https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=JrASdfPCkNw3CYBKAD6E',
        {
          attributions:
            'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18
        }
      )
      .addTo(this.map);
    this.map
      .locate({
        setView: true,
        maxZoom: 10
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
      iconUrl: '../../../assets/icon/colored-drop.png',
      shadowUrl: '../../../assets/icon/drop-shadow.svg',

      iconSize: [25, 30], // size of the icon
      shadowSize: [25, 30], // size of the shadow
      iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [2, -2], // the same for the shadow
      popupAnchor: [-3, -5] // point from which the popup should open relative to the iconAnchor
    });

    this.dropService.getDrops().subscribe((drops: any) => {
      drops.forEach(singledrop => {
        if (this.dropService.isDropVisible(singledrop)) {
            const dropGroup = leaflet.featureGroup();
            // check visibleDrops array of user for drops and add them
            const dist = this.checkDropDistance(singledrop);
            if (dist < 1500) {
                this.setDropVisible(singledrop);
            } else {
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
    // add Drop to visibleDrops array in Firebase
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
