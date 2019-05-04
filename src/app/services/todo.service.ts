import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Device} from '@ionic-native/device/ngx';

export interface Drop {
  id?: string;
  createdAt: number;
  description: string;
  coordinate: number;
  score: number;
  deviceID: string;
}

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private dropsCollection: AngularFirestoreCollection<Drop>;
  private myDropsCollection: AngularFirestoreCollection<Drop>;

  private drops: Observable<Drop[]>;
  private myDrops: Observable<Drop[]>;

    constructor(db: AngularFirestore, private device: Device) {
    this.dropsCollection = db.collection<Drop>('drops');

    this.drops = this.dropsCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
             if ((new Date().getDate() - data.createdAt) < 518400000) {
                return { id, ...data };
             }
          });
        })
    );

    this.myDropsCollection = db.collection('drops', ref => ref.where('deviceID', '==', this.device.uuid));
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
    return this.dropsCollection.add(drop);
  }

  removeDrop(id) {
    return this.dropsCollection.doc(id).delete();
  }
}
