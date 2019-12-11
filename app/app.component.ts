import { Component } from "@angular/core";

import { Platform, MenuController, Events } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import * as firebase from "firebase";
import { TranslateService } from "@ngx-translate/core";
import { Values } from "./shared/values.class";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  user: any;
  public fireAuth: any;
  public userProfiles: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    public events: Events,
    public menuCtrl: MenuController,
    private authSvc: AuthService,
    public values: Values,
    private translate: TranslateService
  ) {
    this.fireAuth = firebase.auth();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.values.userRole = firebase
          .database()
          .ref("/users")
          .child(user.uid)
          .on("value", snapshot => {
            if (snapshot.val()) {
              this.userProfiles = snapshot.val();
            }
          });
      }
    });

    this.storage.ready().then(() => {
      this.storage.get("user").then(val => {
        console.log(val);
        if (val != null) {
          this.user = val;
          this.router.navigateByUrl("inicio");
          this.menuCtrl.enable(true);
        } else {
          this.router.navigateByUrl("login");
          this.menuCtrl.enable(false);
        }
      });
    });

    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.values.isLoggedIn = true;
        this.values.userRole = firebase
          .database()
          .ref("/Customer-Role")
          .child(user.uid)
          .on("value", snapshot => {
            if (snapshot.val()) {
              this.values.userRole = snapshot.val().role;
            }
          });
      }
    });

    this.events.subscribe("user: change", user => {
      if (user || user != null) {
        console.log("userchange");
        console.log(user);
        this.user = user;

        this.values.isLoggedIn = true;

        this.router.navigateByUrl("inicio");
        this.menuCtrl.enable(true);
      } else {
        this.router.navigateByUrl("login");
        this.menuCtrl.enable(false);
      }
    });

    this.initializeApp();
    let userLang = navigator.language.split("-")[0];
    userLang = /(english|deutsch)/gi.test(userLang) ? userLang : "english";
    this.translate.use(userLang);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
