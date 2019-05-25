import { Injectable } from '@angular/core';
import leaflet from 'leaflet';
import * as Geolib from 'geolib';
import {AlertController} from '@ionic/angular';
import {DropService} from './drop.service';
import {AppComponent} from '../app.component';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import {HomePage} from '../pages/home/home.page';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: any;
  constructor(
              public dropService: DropService,
              public appComponent: AppComponent,
              public userService: UserService,
              public alertController: AlertController,
              private router: Router
  ) {
  }
    loadmap(map) {
        this.map = map;
        const positionIcon = leaflet.icon({
            iconUrl: '../../../assets/icon/position.png',
            shadowUrl: '../../../assets/icon/position-shadow.svg',

            iconSize: [30, 30], // size of the icon
            shadowSize: [30, 30], // size of the shadow
            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            shadowAnchor: [2, -2], // the same for the shadow
            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        leaflet.tileLayer(
            'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
            // old tiles 'https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=JrASdfPCkNw3CYBKAD6E',
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
            maxZoom: 22,
            minZoom: 12
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
                this.loadMarkers(this.dropService.getDrops());
            })
            .on('locationerror', err => {
                const longitude = this.appComponent.longitude;
                const latitude = this.appComponent.latitude;

                if (longitude != null && latitude != null) {
                    console.log('location from appcomponent');
                    const markerGroup = leaflet.featureGroup();
                    const marker: any = leaflet
                        .marker([latitude, longitude], {
                            icon: positionIcon,
                            zIndexOffset: -1000 // put the markers on top of the location marker
                        })
                        .on('click', () => {
                            console.log('Position marker clicked');
                        });
                    markerGroup.addLayer(marker);
                    this.map.addLayer(markerGroup);
                    this.loadMarkers(this.dropService.getDrops());
                } else {
                    console.log(err.message);
                    this.locationErrorAlert();
                    return;
                }
            });
        return this.map;
    }

    loadMarkers(dropsToShow) {
        const user = this.userService.getUser();
        let userData;
        let visibleDropsUser;

        user.subscribe(val => {
            userData = val.data();
            visibleDropsUser = userData.visibleDrops;
        });

        dropsToShow.subscribe((drops: any) => {
            const counter = Math.floor(drops.length * 0.2);
            // console.log('Die Anzahl der Kingdrops beträgt ' + counter);
            drops.forEach((singledrop, index) => {
                if (this.dropService.isDropVisible(singledrop)) {
                    // const dropGroup = leaflet.featureGroup();
                    /*if (visibleDropsUser.indexOf(singledrop.dropID) > -1) {
                        if (index < counter) {
                            this.setKingDropVisible(singledrop);
                        } else {
                            this.setDropVisible(singledrop);
                        }
                    } else {

                    }*/
                    const dist = this.checkDropDistance(singledrop);
                    if (dist < 150 && singledrop.score > -10) {
                        this.userService.saveDropToVisibleDrops(singledrop.dropID);
                    }
                    if (index < counter) {
                        if (dist < 150 && singledrop.score > -10) {
                            this.setKingDropVisible(singledrop);
                        } else if (singledrop.score > -10) {
                            this.addOutOfRangeKingDrop(singledrop);
                        }
                    } else {
                        if (dist < 150 && singledrop.score > -10) {
                            this.setDropVisible(singledrop);
                        } else if (singledrop.score > -10) {
                            this.addOutOfRangeDrop(singledrop);
                        }
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
            {
                latitude: drop.latitude,
                longitude: drop.longitude
            }
        );
        // console.log(dist);
        return dist;
    }
    setDropVisible(drop) {
        this.addVisibleDropToMap(drop);
    }
    setKingDropVisible(drop) {
        this.addVisibleKingDropToMap(drop);
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
        HomePage.markersArray.push(drop);
        dropGroup.addLayer(drop);
        HomePage.map.addLayer(dropGroup);
        }
    addVisibleKingDropToMap(dropParam) {
        const coloredKingDropIcon = leaflet.icon({
            iconUrl: '../../../assets/icon/colored-kingdrop.png',
            shadowUrl: '../../../assets/icon/drop-shadow.svg',

            iconSize: [25, 45], // size of the icon
            shadowSize: [25, 30], // size of the shadow
            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            shadowAnchor: [2, -2], // the same for the shadow
            popupAnchor: [-3, -5] // point from which the popup should open relative to the iconAnchor
        });
        const dropGroup = leaflet.featureGroup();
        const drop: any = leaflet
            .marker([dropParam.latitude, dropParam.longitude], {
                icon: coloredKingDropIcon
            })
            .on('click', () => {
                const id = dropParam.id;
                const url = 'drop/';
                const dropUrl = url.concat(id);
                this.router.navigateByUrl(dropUrl);
            });
        HomePage.markersArray.push(drop);
        dropGroup.addLayer(drop);
        HomePage.map.addLayer(dropGroup);
    }
    addOutOfRangeDrop(dropParam) {
        const greyDropIcon = leaflet.icon({
            iconUrl: '../../../assets/icon/grey-drop.png',
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
                icon: greyDropIcon
            })
            .on('click', () => {
                this.presentAlert();
            });
        HomePage.markersArray.push(drop);
        dropGroup.addLayer(drop);
        HomePage.map.addLayer(dropGroup);
    }
    addOutOfRangeKingDrop(dropParam) {
        const greyKingDropIcon = leaflet.icon({
            iconUrl: '../../../assets/icon/grey-kingdrop.png',
            shadowUrl: '../../../assets/icon/drop-shadow.svg',

            iconSize: [25, 45], // size of the icon
            shadowSize: [25, 30], // size of the shadow
            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            shadowAnchor: [2, -2], // the same for the shadow
            popupAnchor: [-3, -5] // point from which the popup should open relative to the iconAnchor
        });
        const dropGroup = leaflet.featureGroup();
        const drop: any = leaflet
            .marker([dropParam.latitude, dropParam.longitude], {
                icon: greyKingDropIcon
            })
            .on('click', () => {
                this.presentAlert();
            });
        HomePage.markersArray.push(drop);
        dropGroup.addLayer(drop);
        HomePage.map.addLayer(dropGroup);
    }

    async presentAlert() {
        const alert = await this.alertController.create({
            header: 'Außer Reichweite!',
            message: 'Diesen Drop musst du zuerst besuchen, bevor du ihn lesen kannst.',
            buttons: ['OK']
        });

        await alert.present();
    }

    async locationErrorAlert() {
        const alert = await this.alertController.create({
            header: 'Dein Standort konnte nicht geortet werden',
            message: 'Wir werden versuchen, deinen Standort erneut festzustellen',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        console.log('Ok clicked');
                        location.reload();
                    }
                },
            ]
        });
        await alert.present();
    }

    clearAllMarkers() {
        const mapToEdit = HomePage.map;
        for (const markers of HomePage.markersArray) {
            mapToEdit.removeLayer(markers);
        }
    }
}
