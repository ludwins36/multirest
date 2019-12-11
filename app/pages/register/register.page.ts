import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { EmailValidator } from "src/validators/email";
import { User } from "src/app/shared/user.class";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import * as firebase from "firebase";
import { AuthService } from "../../services/auth.service";
import { LoadingController, Events } from "@ionic/angular";
import { ServiceService } from "src/app/services/service.service";
import { HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  user: User = new User();
  public signupForm;
  loading: any;

  public currentUser: any;
  public userProfiles: any;

  constructor(
    public formBuilder: FormBuilder,
    private authSvc: AuthService,
    public serviceProv: ServiceService,
    private router: Router,
    public storage: Storage,
    public events: Events,
    public loadingCtrl: LoadingController
  ) {
    this.signupForm = formBuilder.group({
      email: [
        "",
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      firstname: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ],
      lastname: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ],
      phone: [
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ],
      address: [
        "",
        Validators.compose([Validators.minLength(2), Validators.required])
      ]
    });
  }

  ngOnInit() {}

  async onRegister() {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      this.presentLoading();
      await this.authSvc.onRegister(this.user).then(() => {
        authData => {
          console.log(authData);
        };

        this.serviceProv
          .getRestaurantUserProfile(this.currentUser.uid)
          .on("value", snapshot => {
            console.log(snapshot.val());

            this.userProfiles = snapshot.val();

            console.log(this.userProfiles);

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
      });
    }
  }

  async onRegisterWoo() {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      this.presentLoading();
      await this.authSvc.createUser(this.user).then(() => {
        authData => {
          if (authData.ok) {
            console.log(authData);
            console.log("correcto");
          } else {
            console.log(authData);
            console.log("error");
          }
        };
      });
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "waiting",
      duration: 2000
    });
    return await this.loading.present();
  }
}
