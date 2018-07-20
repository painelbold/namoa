import { TravelPlan } from './../../models/travelPlan';
import { AngularFireDatabase } from "../../../node_modules/angularfire2/database";
import { Injectable } from "../../../node_modules/@angular/core";
import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';
import 'rxjs/Rx';

@Injectable()
export class TravelPlanProvider {
  private PATH='announcements/';
  constructor(private db: AngularFireDatabase,) {
  }

  save(tp: TravelPlan, key: string){
    return new Promise((resolve,reject) =>{
      if(tp.key){
        this.db.list(this.PATH + key)
        .update(tp.key, tp)
        .then(()=> resolve)
        .catch((e)=> reject(e))
      }
      else
      {
        this.db.list(this.PATH + key)
        .push(tp)
        .then((result: any) => resolve(result.key))
      }
      }
    );
  }

  getAll(key: string){
    return this.db.list(this.PATH + key)
    .snapshotChanges()
    .map(changes => {
      return changes.map(e=>({key:e.key,...e.payload.val()}));
    })
  }

}
