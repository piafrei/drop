import { Component, ViewChild, ElementRef } from '@angular/core';

import leaflet from 'leaflet';
import { NavController } from '@ionic/angular';
import { Drop, DropService } from '../../services/drop.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  constructor(
      public navCtrl: NavController,
      public dropService: DropService
  ) {}
  ionViewDidEnter() {
    this.loadmap();
  }
  loadmap() {
      let positionIcon = leaflet.icon({
          iconUrl: '../../../assets/icon/position.svg',
          shadowUrl: '../../../assets/icon/position-shadow.svg',

          iconSize:     [50, 50], // size of the icon
          shadowSize:   [50, 50], // size of the shadow
          iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
          shadowAnchor: [2, -2],  // the same for the shadow
          popupAnchor:  [0, 0]  // point from which the popup should open relative to the iconAnchor
      });
    this.map = leaflet.map('map').fitWorld();
    leaflet
      .tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=JrASdfPCkNw3CYBKAD6E', {
        attributions:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
      })
      .addTo(this.map);
    this.map
      .locate({
        setView: true,
        maxZoom: 10
      })
      .on('locationfound', e => {
        let markerGroup = leaflet.featureGroup();
        let marker: any = leaflet
          .marker([e.latitude, e.longitude], {icon: positionIcon})
          .on('click', () => {
            alert('Marker clicked');
          });
        markerGroup.addLayer(marker);
        this.map.addLayer(markerGroup);
      })
      .on('locationerror', err => {
        alert(err.message);
      });
    this.loadMarkers();
  }
  loadMarkers() {
      let dropIcon = leaflet.icon({
          iconUrl: '../../../assets/icon/colored-drop.svg',
          shadowUrl: '../../../assets/icon/drop-shadow.svg',

          iconSize:     [45, 57], // size of the icon
          shadowSize:   [45, 57], // size of the shadow
          iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
          shadowAnchor: [2, -2],  // the same for the shadow
          popupAnchor:  [-3, -5] // point from which the popup should open relative to the iconAnchor
      });

     this.dropService.getDrops().subscribe((drops: any) => {
          drops.forEach((singledrop) => {
              let dropGroup = leaflet.featureGroup();
              let drop: any = leaflet.marker([singledrop.latitude, singledrop.longitude], {icon: dropIcon})
                  .on('click', () => {
                      // Open drop if enabled for user
                  });
              dropGroup.addLayer(drop);
              this.map.addLayer(dropGroup);
          }
          );
     });
  }
}
