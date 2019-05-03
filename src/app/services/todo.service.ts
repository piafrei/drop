import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  private drops: Observable<Drop[]>;

  constructor(db: AngularFirestore) {
    this.dropsCollection = db.collection<Drop>('drops');

    this.drops = this.dropsCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
             if ((new Date().getDate() - a.payload.doc.data().createdAt)  < 518400000) {
                return { id, ...data };
             }
          });
        })
    );
  }

  getDrops() {
    return this.drops;
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
