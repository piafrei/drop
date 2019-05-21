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
private kingdropsCollection: AngularFirestoreCollection<Drop>;

private drops: Observable<Drop[]>;
private myDrops: Observable<Drop[]>;
private kingDrops: Observable<Drop[]>;

private db;

constructor(db: AngularFirestore, private device: Device, private userService: UserService) {
const currentTime = new Date().getTime();
const validPastTimeMillis = 540000000;
const validMinTime = currentTime - validPastTimeMillis;

this.db = db;

this.dropsCollection = db.collection('drops', ref =>
    ref.where('createdAt', '>=', validMinTime)
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
      ref.where('deviceID', '==', this.device.uuid)
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

    const topDrops = 2;

    this.kingdropsCollection = db.collection('drops', ref =>
        ref.orderBy('score', 'desc').limit(topDrops)
    );
    this.kingDrops = this.myDropsCollection.snapshotChanges().pipe(
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

    getKingDrops() {
        return this.kingDrops;
    }

  getDrop(id) {
    return this.dropsCollection.doc<Drop>(id).valueChanges();
  }

  getDropByCat(category) {
    const dropsPerCat = this.db.collection('drops', ref =>
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
