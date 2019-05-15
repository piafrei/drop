import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Device} from '@ionic-native/device/ngx';
import {forEach} from '@angular-devkit/schematics';

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

  getUser(id) {
    return this.userCollection.doc<User>(id).valueChanges();
  }

  updateUser(user: User, id: string) {
    return this.userCollection.doc(id).update(user);
  }

  addUser() {
    const deviceId = this.device.uuid;
    const users = this.getAllUsers();

    users.forEach(function (value) {
    });
    const user: User = {
     deviceID: deviceId,
     visibleDrops: []
   };
    this.userCollection.add(user);
  }

  removeUser(id) {
     return this.userCollection.doc(id).delete();
  }
}
