import { Component, OnInit } from "@angular/core";
import { Capacitor, Plugins, GeolocationPosition } from "@capacitor/core";
import { Observable, of, from as fromPromise } from "rxjs";
import { tap, map, switchMap } from "rxjs/operators";

import { LoadingController, AlertController } from "@ionic/angular";

const { Toast, Geolocation } = Capacitor.Plugins;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  public coordinates$: Observable<GeolocationPosition>;
  public defaultPos: { latitude: 45; longitude: 9 };

  constructor(
    public loading: LoadingController,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // start the loader
    this.displayLoader().then((loader: any) => {
      //get position
      return (
        this.getCurrentPosition()
          .then(position => {
            //close the loader + return position
            loader.dismiss();
            return position;
          })
          //if error
          .catch(err => {
            //close loader + return Null
            loader.dismiss();
            return null;
          })
      );
    });
  }

  async displayLoader() {
    const loading = await this.loading.create({});
    await loading.present();
    return loading;
  }

  private async presentAlert(message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      header: "Alert",
      subHeader: "We are offline",
      message: message,
      buttons: ["OK"]
    });
    await alert.present();
    return alert;
  }

  private async getCurrentPosition(): Promise<any> {
    const isAvailable: boolean = Capacitor.isPluginAvailable("Geolocation");
    if (!isAvailable) {
      console.log("Err: plugin is not available");
      return of(new Error("Err: plugin not available"));
    }
    const POSITION = Plugins.Geolocation.getCurrentPosition()
      //handle Capacitors Errors
      .catch(err => {
        console.log("ERR", err);
        return new Error(err.message || "customized message");
      });
    this.coordinates$ = fromPromise(POSITION).pipe(
      switchMap((data: any) => of(data.coords)),
      tap(data => console.log(data))
    );
    return POSITION;
  }
}
