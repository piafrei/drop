import { Drop, DropService } from '../../services/drop.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    NavController,
    LoadingController,
    AlertController
} from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { AppComponent } from '../../app.component';
import { v4 as uuid } from 'uuid';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-add-drop',
    templateUrl: './add-drop.page.html',
    styleUrls: ['./add-drop.page.scss']
})
export class AddDropPage implements OnInit {
    dropId = null;

    constructor(
        private route: ActivatedRoute,
        private nav: NavController,
        private dropService: DropService,
        private loadingController: LoadingController,
        private device: Device,
        private appComponent: AppComponent,
        private userService: UserService,
        private alertController: AlertController
    ) {}
    drop: Drop = {
        createdAt: new Date().getTime(),
        description: '',
        category: '',
        latitude: this.appComponent.latitude,
        longitude: this.appComponent.longitude,
        score: 0,
        deviceID: this.getInfo(),
        votedBy: [],
        dropID: uuid()
    };

    ngOnInit() {
        this.dropId = this.route.snapshot.params['id'];
        if (this.dropId) {
            this.loadDrop();
        }
    }

    getInfo() {
        let deviceId = this.device.uuid;
        if (deviceId == null) {
            deviceId = 'DESKTOP';
        }
        return deviceId;
    }

    async loadDrop() {
        const loading = await this.loadingController.create({
            message: 'Lädt...'
        });
        await loading.present();

        this.dropService.getDrop(this.dropId).subscribe(res => {
            loading.dismiss();
            this.drop = res;
        });
    }

    async saveDrop() {
        if (
            this.checkDropLocation(this.drop) === true &&
            this.checkDropContent(this.drop) === true &&
            this.checkDropCategory(this.drop) === true
        ) {
            const loading = await this.loadingController.create({
                message: 'Speichern...'
            });
            await loading.present();

            if (this.dropId) {
                if (this.drop.score <= -10) {
                    this.dropService.removeDrop(this.dropId);
                } else {
                    this.dropService.updateDrop(this.drop, this.dropId).then(() => {
                        loading.dismiss();
                        this.nav.back();
                    });
                }
            } else {
                this.userService.improveUserScore(20);
                this.dropService.addDrop(this.drop).then(() => {
                    loading.dismiss();
                    this.nav.back();
                });
            }
        }
    }

    checkDropContent(drop: Drop) {
        const dropContent = drop.description;
        let hasContent = false;
        console.log('content length: ' + dropContent.length);
        if (dropContent !== '') {
            hasContent = true;
            if (dropContent.length > 10) {
                return true;
            } else {
                this.dropWithoutRequiredLength();
                return false;
            }
        } else {
            this.dropWithoutContentAlert();
            return false;
        }
    }

    checkDropCategory(drop: Drop) {
        const dropCat = drop.category;
        if (dropCat !== '') {
            return true;
        } else {
            this.dropWithoutCategoryAlert();
            return false;
        }
    }

    checkDropLocation(drop: Drop) {
        console.log('Latitude:' + drop.latitude);
        if (
            drop.latitude !== undefined &&
            drop.longitude !== undefined &&
            drop.longitude !== null &&
            drop.latitude !== null
        ) {
            return true;
        } else {
            this.dropWithoutLocationAlert();
            return false;
        }
    }

    async dropWithoutLocationAlert() {
        const alert = await this.alertController.create({
            header: 'Dein Standort konnte nicht geortet werden',
            message:
                'Um den Drop richtig anzeigen zu können benötigen wir Deine Standortinformationen. Bitte versuche es erneut',
            buttons: ['OK']
        });

        await alert.present();
    }

    async dropWithoutContentAlert() {
        const alert = await this.alertController.create({
            header: 'Dein Drop ist leer.',
            message: 'Schreibe eine Nachricht mit mehr als 10 Zeichen um zu droppen.',
            buttons: ['OK']
        });

        await alert.present();
    }

    async dropWithoutRequiredLength() {
        const alert = await this.alertController.create({
            header: 'Dein Drop hat weniger als 10 Zeichen.',
            message: 'Schreibe eine Nachricht mit mehr als 10 Zeichen um zu droppen.',
            buttons: ['OK']
        });

        await alert.present();
    }

    async dropWithoutCategoryAlert() {
        const alert = await this.alertController.create({
            header: 'Dein Drop hat keine Kategorie.',
            message: 'Wähle eine Kategorie für Deinen Drop um zu speichern.',
            buttons: ['OK']
        });

        await alert.present();
    }
}
