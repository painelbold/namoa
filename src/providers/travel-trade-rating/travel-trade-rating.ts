import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from '../../../node_modules/firebase';

@Injectable()
export class TravelTradeRatingProvider {
  private PATH='travel-trade-rating/'
  constructor(private db: AngularFireDatabase) {
  }

  rateTrade(date: string, userKey: string, rating: number, trade: string){
    return new Promise((resolve, reject) =>{
      this.db.list(this.PATH + trade)
      .push({
        date: date,
        rating: rating,
        user: userKey,
        user_date: userKey + '_' + date,
        ratingDate: firebase.database.ServerValue.TIMESTAMP,
      })
      .then((result:any) => resolve(result.key))
    })
  }

  getAllTradeRates(trade: string){
    return this.db.list(this.PATH + trade)
    .snapshotChanges()
    .map(changes => {
      console.log("pegou rate" + changes)
      return changes.map(e => ({key: e.key, ...e.payload.val()}) );
    })
  }

}
