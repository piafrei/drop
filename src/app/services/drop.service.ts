import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Device} from '@ionic-native/device/ngx';
import {UserService} from './user.service';

export interface Drop {
    id?: string;
    createdAt: number;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    score: number;
    deviceID: string;
    votedBy: Array<string>;
    dropID: number;
}

@Injectable({
    providedIn: 'root'
})

export class DropService {
    private dropsCollection: AngularFirestoreCollection<Drop>;
    private myDropsCollection: AngularFirestoreCollection<Drop>;

    private drops: Observable<Drop[]>;
    private myDrops: Observable<Drop[]>;
    private kingDrops: Observable<Drop[]>;
    private _visibleDropsUser;

    private db;

    constructor(db: AngularFirestore, private device: Device, private userService: UserService) {

        this.db = db;

        this.dropsCollection = db.collection('drops', ref =>
            ref.orderBy('score', 'desc')
        );

        this.drops = this.dropsCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );

        const user = this.userService.getUser();
        let userData;
        user.subscribe(val => {
            userData = val.data();
            this._visibleDropsUser = userData.visibleDrops; });

        this.myDropsCollection = db.collection('drops', ref =>
            ref.where('deviceID', '==', this.getInfo()).orderBy('score', 'desc')
        );
        this.myDrops = this.myDropsCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );
    }

    getDrops() {
        return this.drops;
    }

    getMyDrops() {
        let myDrops: AngularFirestoreCollection<Drop>;
        myDrops = this.db.collection('drops', ref =>
            ref.where('deviceID', '==', this.getInfo()).orderBy('score', 'desc')
        );
        return myDrops.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            })
        );
        return this.myDrops;
    }

    getKingDrops() {
        return this.kingDrops;
    }

    getDrop(id) {
        return this.dropsCollection.doc<Drop>(id).valueChanges();
    }

    getAllDropsFilter() {
        let allDrops: AngularFirestoreCollection<Drop>;
        allDrops = this.db.collection('drops');
        return allDrops.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            })
        );
    }

    getDropsByCat(category) {
        let dropsPerCat: AngularFirestoreCollection<Drop>;
        dropsPerCat = this.db.collection('drops', ref =>
           ref.where('category', '==', category)
        );
        return dropsPerCat.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            })
        );
    }

    updateDrop(drop: Drop, id: string) {
        return this.dropsCollection.doc(id).update(drop);
    }

    addDrop(drop: Drop) {
        // console.log('Drop Service id to save' + drop.dropID);
        this.userService.saveDropToVisibleDrops(drop.dropID);
        return this.dropsCollection.add(drop);
    }

    removeDrop(id) {
        return this.dropsCollection.doc(id).delete();
    }

    isDropVisible(drop: Drop) {
        let currentScore = drop.score;
        const timeCreated = drop.createdAt;

        let scoreMillis;
        const currentTime = new Date().getTime();
        const validPastMillis = 540000000;

        if (currentScore < 0) {
            scoreMillis = (currentScore * 14.4) * 3600000;
            return (timeCreated + scoreMillis) > (currentTime - validPastMillis);
        } else {
            if (currentScore < 350) {
                currentScore = 350;
            }
            scoreMillis = currentScore * 3600000;
            return (timeCreated + scoreMillis) > (currentTime - validPastMillis);
        }
    }

    getVisibleDropsUser() {
        return this._visibleDropsUser;
    }

    getInfo() {
        let deviceId = this.device.uuid;
        if (deviceId === null) {
            deviceId = 'DESKTOP';
        }
        return deviceId;
    }
}
