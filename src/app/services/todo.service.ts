import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Drop {
  id?: string;
  task: string;
  priority: number;
  createdAt: number;
  description: string;
  coordinate: number;
  score: number;
}

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private dropsCollection: AngularFirestoreCollection<Drop>;

  private todos: Observable<Drop[]>;

  constructor(db: AngularFirestore) {
    this.dropsCollection = db.collection<Drop>('todos');

    this.todos = this.dropsCollection.snapshotChanges().pipe(
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
    return this.todos;
  }

  getDrop(id) {
    return this.dropsCollection.doc<Drop>(id).valueChanges();
  }

  updateDrop(todo: Drop, id: string) {
    return this.dropsCollection.doc(id).update(todo);
  }

  addDrop(todo: Drop) {
    return this.dropsCollection.add(todo);
  }

  removeDrop(id) {
    return this.dropsCollection.doc(id).delete();
  }
}
