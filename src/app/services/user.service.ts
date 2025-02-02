import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Device } from '@ionic-native/device/ngx';
import { Drop } from './drop.service';

export interface User {
  id?: string;
  visibleDrops: Array<number>;
  deviceID: string;
  score: number;
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

    this.db.firestore
      .doc('/users/' + deviceId)
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          // console.log('User exists');
        } else {
          console.log('User doesnt exist');
          const user: User = {
            id: deviceId,
            visibleDrops: [],
            deviceID: deviceId,
            score: 0
          };
          this.db
            .collection('users')
            .doc(deviceId)
            .set(user);
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
    // console.log('User Service Id to save' + id);
    const deviceId = this.getDeviceId();
    const userObservable = this.db
      .collection('users')
      .doc(deviceId)
      .get();
    let userData;
    let visibleDrops;
    userObservable.subscribe(val => {
      userData = val.data();
      visibleDrops = userData.visibleDrops;
      if (!(visibleDrops.indexOf(id) > -1)) {
        visibleDrops.push(id);
        this.userCollection.doc<User>(deviceId).update({
          visibleDrops: visibleDrops
        });
      }
    });
  }

  getUser() {
    const deviceId = this.getDeviceId();
    const user = this.db
      .collection('users')
      .doc(deviceId)
      .get();

    return user;
  }

  getThisUser(deviceId) {
    const user = this.db
      .collection('users')
      .doc(deviceId)
      .get();
    return user;
  }

  // Improves score of this user
  // Triggered at: (1) Upvote another drop; (2) Downvote another drop; (3) Create a drop
  improveUserScore(amount) {
    const userObs = this.getUser();
    let userData;
    userObs.subscribe(val => {
      userData = val.data();
      console.log('improve user: ' + userData.score);
      const score = userData.score + amount;
      this.userCollection.doc(this.getDeviceId()).update({ score: score });
    });
  }

  // Improves the score of the user whose drop you have upvoted
  improveCreatorsScore(amount, creatorId) {
    const userObs = this.getThisUser(creatorId);
    let userData;
    userObs.subscribe(val => {
      userData = val.data();
      const score = userData.score + amount;
      this.userCollection.doc(creatorId).update({ score: score });
    });
  }

  // Decline the score of the user whose drop you have upvoted
  declineCreatorsScore(amount, creatorId) {
    const userObs = this.getThisUser(creatorId);
    let userData;
    userObs.subscribe(val => {
      userData = val.data();
      const score = userData.score - amount;
      this.userCollection.doc(creatorId).update({ score: score });
    });
  }
}
