import { Component, OnInit } from "@angular/core";
import { ServiceService } from "src/app/services/service.service";
import { Componente } from "../../interfaces/interfaces";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core"; // add this
import { Events, MenuController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { Values } from "src/app/shared/values.class";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  componentesAccount: Observable<Componente[]>;
  componentesInfo: Observable<Componente[]>;
  user: any;

  constructor(
    private dataService: ServiceService,
    private translate: TranslateService,
    public events: Events,
    private router: Router,
    private storage: Storage,
    public menuCtrl: MenuController,
    public values: Values,
    public usersProv: AuthService
  ) {
    let userLang = navigator.language.split("-")[0];
    userLang = /(english|deutsch)/gi.test(userLang) ? userLang : "english";
    this.translate.use(userLang);

    this.events.subscribe("user: change", user => {
      if (user || user != null) {
        console.log("userchange");
        console.log(user);
        this.user = user;
      }
    });

    this.storage.ready().then(() => {
      this.storage.get("user").then(val => {
        console.log(val);
        if (val != null) {
          this.user = val;
        }
      });
    });
  }

  ngOnInit() {
    this.componentesAccount = this.dataService.getMenuOptions();
    this.componentesInfo = this.dataService.getMenuOptionsInfo();
  }

  logout() {
    this.usersProv.logoutUser().then(() => {
      this.storage.remove("user");
      this.user = null;
      this.storage.remove("cart_list");
      this.router.navigateByUrl("/login");
      this.menuCtrl.enable(false);
    });
  }
}
