import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from "firebase";
import { User } from "../shared/user.class";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public isLoggerd: any = false;
  public restaurantUserInfo: any;

  constructor(
    public afAuth: AngularFireAuth,
    private facebook: Facebook,
    public http: HttpClient
  ) {
    afAuth.authState.subscribe(user => (this.isLoggerd = user));
    this.restaurantUserInfo = firebase.database().ref("/users");
  }

  // login
  async onLogin(user: User) {
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
    } catch (e) {
      console.log(e);
    }
  }

  // register
  async onRegister(user: User) {
    try {
      return await this.afAuth.auth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(newUser => {
          this.restaurantUserInfo.child(newUser.user.uid).set({
            email: user.email,
            displayName: user.firstname,
            lastName: user.lastname,
            address: user.address,
            phone: user.phone,
            facebook: false
          });
        });
    } catch (e) {
      console.log("Error en registro ", e);
    }
  }

  logoutUser() {
    return this.afAuth.auth.signOut();
  }

  facebookLogin() {
    return new Promise<any>((resolve, reject) => {
      this.facebook.login(["email"]).then(response => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
          response.authResponse.accessToken
        );

        firebase
          .auth()
          .signInWithCredential(facebookCredential)
          .then(success => {
            console.log("Firebase success: " + JSON.stringify(success));

            resolve(success);
            /**
          this.afs.collection('users', ref => ref.where('id_auth', '==', success.uid)).snapshotChanges().subscribe(snapshots => {

            if(snapshots.length <= 0){
              let tempIndex = success.email.indexOf('@');

              this.snapshotChangesSubscription = this.afs.collection('users').add({
                created: Date(),
                active: true,
                username: success.email.slice(0, tempIndex),
                fullname: success.displayName,
                email: success.email,
                phone: (success.phoneNumber != null)? success.phoneNumber : '',
                address: '',
                avt: success.photoURL,
                id_auth: success.uid
              })
            }

          });

  	  */
          });
      });
    }).catch(error => {
      console.log(error);
    });
  }

  createUser(user: User) {
    const header = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    const url = "https://app.biciaccesorios.online";
    const consumerKey = "ck_c7344057109c164aba3bcaf22b1e75894d39c50d";
    const consumerSecret = "cs_58c40f90817c3a1069355bc61c0b264dc35e334a";
    const data = `username=${user.firstname}&email=${user.email}&phone=${user.phone}&password=${user.password}`;
    return new Promise((resolve, reject) => {
      this.http
        .post(
          `${url}/wp-json/wc/v3/customers?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
          data,
          { headers: header }
        )
        
        .subscribe(
          res => { 
            resolve(res);
          },
          error =>{
            
            console.log(error);
            resolve(error);
          }
        )
        // .subscribe(customerData => {

        //   resolve(customerData);
        // })
    }).catch(error => {
      console.log('error');
      console.log(error);
    });
  }
}
