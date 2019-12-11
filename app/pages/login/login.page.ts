import { Component, OnInit, Inject } from "@angular/core";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { Events, LoadingController, AlertController } from "@ionic/angular";
import { FormBuilder, Validators } from "@angular/forms";
import { EmailValidator } from "src/validators/email";
import { User } from "src/app/shared/user.class";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Values } from "src/app/shared/values.class";
import { ServiceService } from "src/app/services/service.service";

import * as firebase from "firebase";
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  user: User = new User();
  public loginForm;
  loading: any;
  userProfile: any = null;
  disableLogin: boolean = false;
  userProfiles: any = null;
  public currentUser: any;
  require: any;


  constructor(
    @Inject(Facebook) private fb: Facebook,
    public events: Events,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    private router: Router,
    private authSvc: AuthService,
    public values: Values,
    public service: ServiceService,
    public http: HttpClient,
  ) {
    
    this.loginForm = formBuilder.group({
      email: [
        "",
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });

    

    // let WooCommerce = new WooCommerceAPI({
    //   url: "https://app.biciaccesorios.online",
    //   consumerKey: "ck_c7344057109c164aba3bcaf22b1e75894d39c50d",
    //   consumerSecret: "cs_58c40f90817c3a1069355bc61c0b264dc35e334a",
    // });



  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: "Alert",
      subHeader: "Subtitle",
      message: "This is an alert message.",
      buttons: ["OK"]
    });
    await alert.present();
  }

  async presentAlertErr() {
    const alert = await this.alertCtrl.create({
      message: "login failed!",
      buttons: [
        {
          text: "Ok",
          role: "cancel"
        }
      ]
    });
    await alert.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "waiting",
      duration: 2000
    });
    return await this.loading.present();
  }

  async loginUser() {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.presentLoading();
      await this.authSvc.onLogin(this.user).then(
        authData => {
          this.currentUser = firebase.auth().currentUser;
          this.service
            .getRestaurantUserProfile(authData.user.uid)
            .on("value", snapshot => {
              this.userProfiles = snapshot.val();

              this.loading.dismiss().then(() => {
                let user = {
                  avt: this.userProfiles.facebook,
                  username: this.userProfiles.displayName,
                  fullname: this.userProfiles.lastName,
                  email: this.userProfiles.email,
                  address: this.userProfiles.address,
                  phone: this.userProfiles.phone,
                  id: this.currentUser.uid
                };
                this.storage.set("user", user);
                this.events.publish("user: change", user);
                //	console.log(data);
                this.router.navigateByUrl("/inicio");
              });
            });
        },
        error => {
          this.loading.dismiss().then(() => {
            this.presentAlertErr();
          });
        }
      );
    }
  }

  login_fb() {
    this.authSvc.facebookLogin()
    .then(
      authData => {
        console.log(authData);
        /**
  		this.usersProv.getUser(authData.uid).then(data => {
  			let user = {
  				avt: data[0].payload.doc.data().avt,
  				username: data[0].payload.doc.data().username,
  				fullname: data[0].payload.doc.data().fullname,
  				email: data[0].payload.doc.data().email,
  				address: data[0].payload.doc.data().address,
  				phone: data[0].payload.doc.data().phone,
  				id: data[0].payload.doc.id,
  				id_auth: data[0].payload.doc.data().id_auth
  			}
  			this.storage.set('user', user).then(() => {
  				this.loading.dismiss().then(() => {
  					this.events.publish('user: change', user);
  					this.router.navigateByUrl('home');
  				});
  			});
  		})

  		*/
      },
      error => {
        this.loading.dismiss().then(() => {
          this.presentAlertErr();
        });
      }
    );
    this.presentLoading();
  }

  ngOnInit() {}

  
  loginUsers(username, password) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const userData = `username=${username}&password=${password}`; 
    const url = 'https://swift-footed-config.000webhostapp.com';
    return new Promise((resolve, reject) => {
      this.http
        .post(`${url}/wp-json/jwt-auth/v1/token`, userData, { headers })
        .subscribe(
          res => {
            resolve(res);
          },
          err => {
            resolve(err);
          }
        );
    });
  }
}
