import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';


@Injectable()
export class FirebaseAuthService {

    authState: any = null;
    tokenData = '';
    constructor(
        private afAuth: AngularFireAuth,
        // private db: AngularFirestore,
        private router: Router) {

        this.afAuth.authState.subscribe((auth) => {
            this.authState = auth;
        });
    }

    get token(): Observable<string | null> {
        this.setToken(this.afAuth.idToken);
        return this.afAuth.idToken;
    }

    setToken(tokenObservable: Observable<string | null>) {
        tokenObservable.subscribe(res => {
            this.tokenData = res;
        });
    }

    getTokenString() {
        return this.tokenData;
    }
    // Returns true if user is logged in
    get authenticated(): boolean {
        return this.authState !== null;
    }

    // Returns current user data
    get currentUser(): any {
        return this.authenticated ? this.authState : null;
    }

    // Returns
    get currentUserObservable(): any {
        return this.afAuth.authState;
    }

    // Returns current user UID
    get currentUserId(): string {
        return this.authenticated ? this.authState.uid : '';
    }

    // Anonymous User
    get currentUserAnonymous(): boolean {
        return this.authenticated ? this.authState.isAnonymous : false;
    }

    // Returns current user display name or Guest
    get currentUserDisplayName(): string {
        if (!this.authState) { return 'Guest'; }
        if (this.currentUserAnonymous) { return 'Anonymous'; }
        return this.authState.displayName || 'User without a Name';
    }

    //// Social Auth ////

    githubLogin() {
        const provider = new firebase.auth.GithubAuthProvider();
        return this.socialSignIn(provider);
    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.socialSignIn(provider);
    }

    facebookLogin() {
        const provider = new firebase.auth.FacebookAuthProvider();
        return this.socialSignIn(provider);
    }

    twitterLogin() {
        const provider = new firebase.auth.TwitterAuthProvider();
        return this.socialSignIn(provider);
    }

    private socialSignIn(provider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {
                this.authState = credential.user;
                this.updateUserData();
            })
            .catch(error => console.log(error));
    }


    //// Anonymous Auth ////

    anonymousLogin() {
        return this.afAuth.auth.signInAnonymously()
            .then((user) => {
                this.authState = user;
                this.updateUserData();
            })
            .catch(error => console.log(error));
    }

    customLogin(token: string) {
        return this.afAuth.auth.signInWithCustomToken(token)
            .then((user) => {
                console.log(user);
                this.authState = user;
                this.updateUserData();
            }).catch(error => console.log(error));
    }

    //// Email/Password Auth ////

    emailSignUp(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                this.authState = user;
                this.updateUserData();
            })
            .catch(error => console.log(error));
    }

    emailLogin(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                this.authState = user;
                this.updateUserData();
            })
            .catch(error => console.log(error));
    }

    // Sends email allowing user to reset password
    resetPassword(email: string) {
        const auth = firebase.auth();

        return auth.sendPasswordResetEmail(email)
            .then(() => console.log('email sent'))
            .catch((error) => console.log(error));
    }


    //// Sign Out ////

    signOut(): void {
        this.afAuth.auth.signOut();
        this.router.navigate(['/']);
    }


    //// Helpers ////

    private updateUserData(): void {
        // Writes user name and email to realtime db
        // useful if your app displays information about users or for admin features

        const path = `users/${this.currentUserId}`; // Endpoint on firebase
        const data = {
            email: this.authState.email,
            name: this.authState.displayName
        };

    }
}
