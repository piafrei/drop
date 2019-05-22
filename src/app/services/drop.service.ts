import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

    constructor(db: AngularFirestore, private device: Device, private userService: UserService) {
        const currentTime = new Date().getTime();
        const validPastTimeMillis = 540000000;
        const validMinTime = currentTime - validPastTimeMillis;

        this.dropsCollection = db.collection('drops', ref =>
            ref.where('createdAt', '>=', validMinTime).orderBy('score', 'desc')
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

        this.myDropsCollection = db.collection('drops', ref =>
            ref.where('deviceID', '==', this.device.uuid).orderBy('score', 'desc')
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
        return this.myDrops;
    }

    getDrop(id) {
        return this.dropsCollection.doc<Drop>(id).valueChanges();
    }

    updateDrop(drop: Drop, id: string) {
        return this.dropsCollection.doc(id).update(drop);
    }

    addDrop(drop: Drop) {
        console.log('Drop Service id to save' + drop.dropID);
        this.userService.saveDropToVisibleDrops(drop.dropID);
        return this.dropsCollection.add(drop);
    }

    removeDrop(id) {
        return this.dropsCollection.doc(id).delete();
    }

    isDropVisible(drop: Drop) {
        const currentScore = drop.score;
        const timeCreated = drop.createdAt;

        let scoreMillis;
        const currentTime = new Date().getTime();
        const validPastMillis = 540000000;

        // console.log(currentTime);
        if (currentScore < 0) {
            scoreMillis = (currentScore * 14.4) * 3600000;
            return (timeCreated + scoreMillis) > (currentTime - validPastMillis);
        } else {
            scoreMillis = currentScore * 3600000;
            return (timeCreated + scoreMillis) > (currentTime - validPastMillis);
        }
    }
}
