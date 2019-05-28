import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSelect, LoadingController, NavController } from '@ionic/angular';
import { Drop, DropService } from '../../services/drop.service';
import { Device } from '@ionic-native/device/ngx';
import { AppComponent } from '../../app.component';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-drop',
    templateUrl: './drop.page.html',
    styleUrls: ['./drop.page.scss']
})
export class DropPage implements OnInit {
    dropId = null;
    allDrops: Drop[];
    myDrops: Drop[];

    disableButton = false;
    disableUpVoteBtn = false;
    disableDownVoteBtn = false;
    allowedtovote = true;

    upVoteBtnPick: string;
    downVoteBtnPick: string;

    constructor(
        private route: ActivatedRoute,
        private nav: NavController,
        private dropService: DropService,
        private loadingController: LoadingController,
        private device: Device,
        private appComponent: AppComponent,
        private http: HttpClient,
        public alertController: AlertController,
        private userService: UserService
    ) {}
    drop: Drop = {
        createdAt: new Date().getTime(),
        description: '',
        category: '',
        latitude: this.appComponent.latitude,
        longitude: this.appComponent.longitude,
        score: 0,
        deviceID: this.getInfo(),
        dropID: 0,
        votedBy: []
    };

    @ViewChild('showSelect') selectRef: IonSelect;

    openSelect() {
        this.selectRef.open();
    }

    ngOnInit() {
        this.dropId = this.route.snapshot.params['id'];
        if (this.dropId) {
            this.loadDrop();
        }
        this.upVoteBtnPick = 'assets/icon/upvote.svg';
        this.downVoteBtnPick = 'assets/icon/downvote.svg';
    }

    disableReport() {
        this.disableButton = true;
    }
    dropIsVoted() {
        this.disableDownVoteBtn = true;
        this.disableUpVoteBtn = true;
        console.log('downvoted');
    }
    setNewUpIcon() {
        this.downVoteBtnPick = 'assets/icon/downvote_disabled.svg';
        this.upVoteBtnPick = 'assets/icon/upvote.svg';
    }
    setNewDownIcon() {
        this.downVoteBtnPick = 'assets/icon/downvote.svg';
        this.upVoteBtnPick = 'assets/icon/upvote_disabled.svg';
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
            this.checkVoteAllowed(this.drop.votedBy);
        });
    }

    checkVoteAllowed(votedBy) {
        const currentUuid = this.getInfo();
        const creatorId = this.drop.deviceID;
        let allowedtovoteVar = true;
        let ismydrop = false;

        console.log('current id ' + currentUuid);
        console.log('creator ' + creatorId);
        console.log('votedBy ' + votedBy[0]);
        console.log('mein drop: ' + this.drop.dropID);

        if (currentUuid === creatorId) {
            console.log('eigener drop');
            ismydrop = true;
        }

        for (const uuid of votedBy) {
            if (uuid === currentUuid) {
                allowedtovoteVar = false;
                console.log('bereits gevotet');
            }
        }

        if (allowedtovoteVar === false || ismydrop === true) {
            this.allowedtovote = false;
            console.log('allowedtoVote is set: ' + this.allowedtovote);
            this.dropIsVoted();
        } else {
        }
    }

    voteUp(score) {
        const currentUuid = this.getInfo();

        if (this.allowedtovote === true) {
            this.drop.score = score + 1;
            this.userService.improveUserScore(1);
            this.userService.improveCreatorsScore(1, this.drop.deviceID);
            this.drop.votedBy.push(currentUuid);
            this.dropService.updateDrop(this.drop, this.dropId);
            this.dropIsVoted();
            this.setNewUpIcon();
            this.allowedtovote = false;
        }
    }

    voteDown(score) {
        const currentUuid = this.getInfo();

        if (this.allowedtovote === true) {
            this.drop.score = score - 1;
            this.userService.improveUserScore(1);
            this.userService.improveCreatorsScore(1, this.drop.deviceID);
            this.drop.votedBy.push(currentUuid);
            this.dropService.updateDrop(this.drop, this.dropId);
            this.dropIsVoted();
            this.setNewDownIcon();
            this.allowedtovote = false;
        }
    }

    showMore(drop, event) {
        if (event.detail.value === 'report') {
            const baseUrl = 'https://us-central1-dropdb-55efa.cloudfunctions.net';
            const url = baseUrl.concat('/sendMail?dest=reportdropapp@gmail.com&dropId=', drop.dropID, '&reporterId=', this.getInfo(), '&dropDescription=', drop.description, '&userId=', drop.deviceId);
            console.log('Drop ID ist: ' + drop.dropID + 'Device ID ist: ' + drop.deviceId + 'Info ist: ' + this.getInfo());
            this.outOfRangeAlert();
            return this.http.get(url, { observe: 'response' }).subscribe(response => {
                console.log(response.status);
                console.log(response.headers.get('X-Custom-Header'));
            });
        }
    }
    async outOfRangeAlert() {
        const alert = await this.alertController.create({
            header: 'Drop wurde gemeldet',
            message:
                'Wir kümmern uns so schnell wie möglich darum, den Drop zu überprüfen.',
            buttons: ['OK']
        });

        await alert.present();
    }

    async saveDrop() {
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
            if (this.checkDropLocation(this.drop) === true) {
                this.dropService.addDrop(this.drop).then(() => {
                    loading.dismiss();
                    this.nav.back();
                });
            }
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
                'Um den Drop richtig anzeigen zu können benötigen wir deine Standortinformationen. Bitte versuche es erneut',
            buttons: ['OK']
        });

        await alert.present();
    }
}
