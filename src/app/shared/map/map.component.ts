import { Component, AfterViewInit, Input } from "@angular/core";
/// <reference path="<relevant path>/node_modules/@types/googlemaps/index.d.ts" />
import {} from "googlemaps";

declare var google: any;

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements AfterViewInit {
  @Input() coords: { latitude: number; longitude: number };

  constructor() {}

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const POSITION = { lat: this.coords.latitude, lng: this.coords.longitude };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: POSITION || { lat: 22, lng: 22 }
    });
    const marker = new google.maps.Marker({
      position: POSITION,
      map: map
    });
  }
}
