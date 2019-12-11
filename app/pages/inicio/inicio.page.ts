import { Component, OnInit, Inject } from "@angular/core";
import {
  Events,
  ToastController,
  NavController,
  LoadingController
} from "@ionic/angular";
import { ServiceService } from "src/app/services/service.service";
import { Values } from "src/app/shared/values.class";
import { Router } from "@angular/router";
import * as firebase from "firebase";
import { Storage } from "@ionic/storage";
import * as WC from "woocommerce-api";


@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.page.html",
  styleUrls: ["./inicio.page.scss"]
})
export class InicioPage implements OnInit {
  Woocommerce: any;
  list_product: any;
  list_product_new: any;
  list_product_slide: any;
  loading: any;
  start: any;
  id_user: any;
  favo_str: string = "";
  id_favo_str: any;
  list_cart: Array<any>;

  shops: any;

  userProfiles: any;
  currentUser: any;

  constructor(
    public events: Events,
    public toastCtrl: ToastController,
    private storage: Storage,
    public navCtrl: NavController,
    public service: ServiceService,
    public loadingCtrl: LoadingController,
    public values: Values,
    public router: Router
  ) {
    this.presentLoading();

    this.shops = [];
    this.Woocommerce = WC({
      url: 'https://app.biciaccesorios.online',
      consumerKey: 'ck_c7344057109c164aba3bcaf22b1e75894d39c50d',
      consumerSecret: 'cs_58c40f90817c3a1069355bc61c0b264dc35e334a',
      wpAPI: true,
      version: 'wc/v3',
    });

    this.Woocommerce.getAsync("customers?role=wcfm_vendor").then(
      
      data =>{
        let vendors = JSON.parse(data.body);
        console.log(vendors);

        vendors.forEach(snap =>{
          this.shops.push({
            id: snap.id,
            title: snap.first_name,
            subtitle: snap.last_name,
            img: snap.avatar_url

          });
        })
        console.log(this.shops);
      },
      error =>{
        console.log(error);
      }
    )

    this.service.getRestaurantsList().on("value", snapshot => {
      console.log(snapshot.val());

      // this.shops = [];

      // snapshot.forEach(snap => {
      //   //this.params.data.items.push({
      //   this.shops.push({
      //     id: snap.key,
      //     title: snap.val().title,
      //     subtitle: snap.val().info,
      //     logo: snap.val().logo,
      //     description: snap.val().info,
      //     firebase_url: snap.val().firebase_url
      //   });
      // });

      console.log(this.shops);
    });

    this.events.subscribe("cart_list: change", lst => {
      this.list_cart = lst;
    });

    this.events.subscribe("user: change", user => {
      if (user || user != null) {
        console.log(user);
        this.id_user = user.uid;

        console.log(this.id_user);
      }
    });
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "waiting",
      duration: 2000
    });
    return await this.loading.present();
  }

  ngOnInit() {}

  ionViewWillEnter() {}
}
