import 'rxjs/Rx';

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../auth/auth-service';
import { Usuario } from './../../models/usuario';

@Injectable()
export class UserDataProvider {
  private PATH='users/';

  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {

    }

  saveUserData(usuario: Usuario, key: string){
    return new Promise((resolve, reject) => {
      if(key){
        this.db.list(this.PATH)
        .update(key, usuario)
        .then(() => resolve())
        .catch((e) => reject(e))
      }
      else{
        this.db.database
        .ref(this.PATH + this.authService.getLoggedUser().uid)
        .set({ fullName: usuario.fullName || '',
             email: usuario.email || '',
             })
      }
    });
  }

  getUserData(){
    return this.db.object(this.PATH + this.authService.getLoggedUser().uid)
    .snapshotChanges()
    .map(u =>{
      return { key: u.key, ...u.payload.val()};
    });
  }

}
