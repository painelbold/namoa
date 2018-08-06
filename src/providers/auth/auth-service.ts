import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../models/usuario';

@Injectable()
export class AuthService {
    user: Observable<firebase.User>;

    constructor(private angularFireAuth: AngularFireAuth,
                private db: AngularFireDatabase){
        this.user = angularFireAuth.authState;
    }

    createUser(user: any){
        return this.angularFireAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
    }

    signOut(){
        return this.angularFireAuth.auth.signOut();
    }

    signIn(user: any){
        return this.angularFireAuth.auth.signInWithEmailAndPassword(user.email, user.password);
    }

    resetPassword(email: string){
        return this.angularFireAuth.auth.sendPasswordResetEmail(email);
    }

    getLoggedUser(){
        return this.angularFireAuth.auth.currentUser;
    }

    changePassword(passwords: any){
      var credential = firebase.auth.EmailAuthProvider.credential(this.angularFireAuth.auth.currentUser.email, passwords.old);
      return this.angularFireAuth.auth.currentUser.reauthenticateWithCredential(credential)
      .then(() => {
        this.angularFireAuth.auth.currentUser.updatePassword(passwords.new)
      }
      )
    }
}
