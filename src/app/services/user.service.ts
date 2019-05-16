import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Device} from '@ionic-native/device/ngx';
export interface User {
    id?: string;
    visibleDrops: Array<string>;
    deviceID: string;
}
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userCollection: AngularFirestoreCollection<User>;
    private user: Observable<User[]>;
    constructor(db: AngularFirestore, private device: Device) {
        this.userCollection = db.collection('users');
        this.user = this.userCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );
    }
    getAllUsers() {
        return this.user;
    }
    addUser() {
        const deviceId = this.device.uuid;
        const users = this.getAllUsers();
        let userArray = null;
        users.subscribe(userElement => {
            userArray = userElement as User[];
            console.log('subscribed' + userArray);
        });
        let userExists = false;
        if (users != null) {
            for (const userElement of userArray) {
                if (userElement.deviceID === deviceId) {
                    userExists = true;
                }
            }
            if (userExists === false) {
                const user: User = {
                    deviceID: deviceId,
                    visibleDrops: []
                };
                this.userCollection.add(user);
            }
        }
    }
    saveDrop() {
    }
}
