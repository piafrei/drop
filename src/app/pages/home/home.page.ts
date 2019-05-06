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
    this.map = leaflet.map('map').fitWorld();
    leaflet
      .tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
          .marker([e.latitude, e.longitude])
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
     this.dropService.getDrops().subscribe((drops: any) => {
          drops.forEach((singledrop) => {
              alert('foreach triggered with ' + singledrop.description + ' in lat. ' + singledrop.latitude + ' lon. ' + singledrop.longitude);
              let dropGroup = leaflet.featureGroup();
              let drop: any = leaflet.marker([singledrop.latitude, singledrop.longitude])
                  .on('click', () => {
                      // Open drop if enabled for user
                  });
              dropGroup.addLayer(drop);
              this.map.addLayer(dropGroup);
              alert('everything triggered');
          }
          );
     });
  }
}
