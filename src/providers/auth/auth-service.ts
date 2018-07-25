import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

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
}
