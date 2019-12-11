import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Componente } from "src/app/interfaces/interfaces";
import { User } from "../shared/user.class";

@Injectable({
  providedIn: "root"
})
export class ServiceService {
  public restaurantUserInfo: any;
  public restaurants: any;
  public restaurant: any;
  public chats: any;
  public category: any;
  public restaurantCategory: any;
  public restaurantItems: any;
  public items: any;
  public url: any;
  public consumerKey: any;
  public consumerSecret: any;

  constructor(
    private http: HttpClient,
    
  ) {
    this.restaurantUserInfo = firebase.database().ref("/users");
    this.restaurants = firebase.database().ref("/restaurants");
    this.chats = firebase.database().ref("/chats");
    this.restaurantCategory = firebase.database().ref("/category");
    this.items = firebase.database().ref("/items");
    this.url = "https://swift-footed-config.000webhostapp.com";
    this.consumerKey = "ck_bc98995c28477bc2fce7bb5eb49e7cc839c71801";
    this.consumerSecret = "cs_66c7d6d45ae47e8a490f6fe8540298e1c77fd060";
  }

  getRestaurantUserProfile(id): any {
    return this.restaurantUserInfo.child(id);
  }

  getItemLists(id) {
    console.log(id);
    this.restaurantItems = this.items.orderByChild("categories").equalTo(id);
    return this.restaurantItems;
  }

  getMenuOptions() {
    return this.http.get<Componente[]>("/assets/data/menu.json");
  }
  getMenuOptionsInfo() {
    return this.http.get<Componente[]>("/assets/data/menuInfo.json");
  }

  getRestaurantsList(): any {
    console.log(this.restaurants);
    return this.restaurants;
  }

  getRestaurantId(id) {
    return this.restaurants.child(id);
  }

  getUserProfile(id): any {
    return this.restaurantUserInfo.child(id);
  }

  getRestaurantCategoryLists(id) {
    console.log(id);
    this.category = this.restaurantCategory
      .orderByChild("res_name")
      .equalTo(id);
    return this.category;
  }

  getProducts() {
    return `${this.url}/wp-json/wcfmmp/v1/products?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`;
  }

  addRoom(uid, data, userImage, userName) {
    console.log(data);

    this.chats
      .child(data.owner_id)
      .child(data.id)
      .child("chat")
      .child(uid)
      .child("list")
      .child("-0000")
      .set({
        type: "join",
        user: "user",
        message: "Welcome to restaurant.",
        timeStamp: firebase.database.ServerValue.TIMESTAMP,
        sendDate: ""
      });

    this.chats
      .child(data.owner_id)
      .child(data.id)
      .child("chat")
      .child(uid)
      .update({
        restaurantTitle: data.title,
        restaurantImage: data.firebase_url,
        restaurantOwnerId: data.owner_id,
        timeStamp: firebase.database.ServerValue.TIMESTAMP,
        userImage: userImage,
        userName: userName,
        lastMessage: "Hello Dear"
      });

    this.chats
      .child(uid)
      .child("chat")
      .child(data.id)
      .child("list")
      .child("-0000")
      .set({
        type: "join",
        user: "user",
        message: "Welcome to restaurant.",
        sendDate: ""
      });

    return this.chats
      .child(uid)
      .child("chat")
      .child(data.id)
      .update({
        restaurantTitle: data.title,
        restaurantImage: data.firebase_url,
        restaurantOwnerId: data.owner_id,
        userImage: userImage,
        userName: userName,
        lastMessage: "Hello Dear"
      });
  }
}
