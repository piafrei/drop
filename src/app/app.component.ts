import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private _latitude: number;
  private _longitude: number;

    constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private geolocation: Geolocation,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

      const watchLocation = this.geolocation.watchPosition();
      watchLocation.subscribe((data) => {
          this._latitude = data.coords.latitude;
          this._longitude = data.coords.longitude;
      });

      // this.addUser();
  }
    addUser() {
      this.userService.addUser();
    }

    get longitude(): number {
        return this._longitude;
    }
    get latitude(): number {
        return this._latitude;
    }
}
