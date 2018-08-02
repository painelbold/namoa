import 'rxjs/Rx';

import { Injectable } from '../../../node_modules/@angular/core';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';
import { TravelPlan } from './../../models/travelPlan';
import firebase from '../../../node_modules/firebase';

@Injectable()
export class TravelPlanProvider {
  private PATH='travel-plans/';
  constructor(private db: AngularFireDatabase,) {
  }

  save(tp: TravelPlan, key: string){
    return new Promise((resolve,reject) =>{
      if(tp.key){
        this.db.list(this.PATH + key)
        .update(tp.key, tp)
        .then((result: any) => resolve(tp.key))
        .catch((e)=> reject(e))
      }
      else
      {
        tp.publishDate = firebase.database.ServerValue.TIMESTAMP;

        this.db.list(this.PATH + key)
        .push(tp)
        .then((result: any) => resolve(result.key))
      }
      }
    );
  }

  getAll(key: string){
    return this.db.list(this.PATH + key, ref=>
      ref.orderByChild("publishDate"))
    .snapshotChanges()
    .map(changes => {
      return changes.map(e=>({key:e.key,...e.payload.val()}));
    })
  }

  delete(uid: string, key: string){
    return this.db.object(this.PATH + uid + '/' + key).remove();
  }

}
