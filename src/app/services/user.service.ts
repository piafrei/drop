import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Device} from '@ionic-native/device/ngx';
import {Drop} from './drop.service';

export interface User {
    id?: string;
    visibleDrops: Array<number>;
    deviceID: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userCollection: AngularFirestoreCollection<User>;

  private user: Observable<User[]>;
  private db;

  constructor(db: AngularFirestore, private device: Device) {
      this.db = db;
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

  addUser() {
    const deviceId = this.getDeviceId();

    this.db.firestore.doc('/users/' + deviceId).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
        console.log('User exists');
        } else {
        console.log('User doesnt exist');
        const user: User = {
            id: deviceId,
            visibleDrops: [],
            deviceID: deviceId
        };
        this.db.collection('users').doc(deviceId).set(user);
        }
    });
    }

    private getDeviceId() {
      let deviceID = this.device.uuid;
      if (deviceID == null) {
          deviceID = 'DESKTOP';
      }
      return deviceID;
    }

    saveDropToVisibleDrops(id: number) {
     console.log('User Service Id to save' + id);
     const deviceId = this.getDeviceId();
     const userObservable = this.db.collection('users').doc(deviceId).get();
     let userData;
     let visibleDrops;
     userObservable.subscribe(val => {
       userData = val.data();
       visibleDrops = userData.visibleDrops;
       visibleDrops.push(id);
       this.userCollection.doc<User>(deviceId).update({
             visibleDrops: visibleDrops});
     });
    }
}
