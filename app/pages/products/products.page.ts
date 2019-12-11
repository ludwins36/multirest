import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ServiceService } from "src/app/services/service.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  id: any;
  productsList: any;
  categoryList: any;
  params: any = {};
  items: any;
  restaurantName: any;
  owner_id: any;
  cat_id: any;
  img: any;
  loading: any;
  title: any;
  catTitle: any;
  desc: any;

  constructor(private route: ActivatedRoute, public service: ServiceService) {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.title = params.title;
      this.owner_id = params.owner_id;
      this.cat_id = params.cat_id;
      this.img = params.img;
      this.catTitle = params.cartTitle;
      this.desc = params.desc

      this.service.getItemLists(this.cat_id).on("value", snapshot => {
        this.productsList = [];

        snapshot.forEach(snap => {
          this.productsList.push({
            id: snap.key,
            price: snap.val().price,
            favorite: false,
            title: snap.val().name,
            image: snap.val().image_firebase_url
          });
        });

        console.log(this.productsList);
      });

    });
   }

  ngOnInit() {
  }

}
