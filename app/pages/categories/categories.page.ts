import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ServiceService } from "src/app/services/service.service";
import * as WC from "woocommerce-api";


@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  styleUrls: ["./categories.page.scss"]
})
export class CategoriesPage implements OnInit {
  Woocommerce: any;

  id: any;
  shopt: any;
  productsList: any;
  categoryList: any;
  params: any = {};
  title: any;
  description: any;
  owner_id: any;
  items: any = {};

  loading: any;
  constructor(private route: ActivatedRoute, public service: ServiceService) {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.title = params.title;
      this.description = params.description;

      this.Woocommerce = WC({
        url: 'https://app.biciaccesorios.online',
        consumerKey: 'ck_c7344057109c164aba3bcaf22b1e75894d39c50d',
        consumerSecret: 'cs_58c40f90817c3a1069355bc61c0b264dc35e334a',
        wpAPI: true,
        version: 'wc/v3',
      });
  
      this.Woocommerce.getAsync("products/categories").then(
        
        data =>{
          let vendors = JSON.parse(data.body);
          console.log(vendors);
  
          // vendors.forEach(snap =>{
          //   this.shops.push({
          //     id: snap.id,
          //     title: snap.first_name,
          //     subtitle: snap.last_name,
          //     img: snap.avatar_url
  
          //   });
          // })
        },
        error =>{
          console.log(error);
        }
      )

      // llamar productos de ese vendedor 

      // this.service.getRestaurantId(this.id).on("value", snapshot => {
      //   this.shopt = snapshot.val();
      //   console.log(this.shopt);
      // });

      // this.service.getRestaurantCategoryLists(this.id).on("value", snapshot => {
      //   this.categoryList = [];
      //   this.items = [];

      //   snapshot.forEach(snap => {
      //     this.items.push({
      //       id: snap.val().cat_id
      //     });

      //     this.categoryList.push({
      //       id: snap.key,
      //       category: snap.val().cat_id,
      //       title: snap.val().cat_name,
      //       subtitle: snap.val().cat_name,
      //       ionBadge: snap.val().cat_name,
      //       image: snap.val().firebase_url
      //     });
      //   });
      //   console.log(this.categoryList);
      // });

      this.productsList = [];
    });
  }

  ngOnInit() {}
}
