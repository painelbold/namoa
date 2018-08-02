import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';
import { TravelTrade } from '../../models/travelTrade';
import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';
import firebase from '../../../node_modules/firebase';

@Injectable()
export class TravelPlanTradesProvider {
  private PATH='travel-plans-trades/';

  constructor(private db: AngularFireDatabase,) {
  }

  save(tt: Array<TravelTrade>, tpKey: string){
    return new Promise((resolve, reject) => {
      tt.forEach(element => {
        if(element.key){
          this.db.list(this.PATH + tpKey)
          .update(element.key, tt)
          .then(()=> resolve)
          .catch((e)=>reject(e))
        }
        else
        {
          element.publishDate = firebase.database.ServerValue.TIMESTAMP;

          this.db.list(this.PATH + tpKey)
          .push(tt)
          .then((result: any) => resolve(result.key))
        }
      });
    });
  }

  getAllByStartDate(key: string){
    return this.db.list(this.PATH + key, ref=>
    ref.orderByChild("startDateTrader"))
    .snapshotChanges()
    .map(changes => {
      return changes.map(e => ({
        key: e.key, ...e.payload.val()
      }));
    })
  }

  delete(key: string){
    return this.db.list(this.PATH + key).remove();
  }

}
