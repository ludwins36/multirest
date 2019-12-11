import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { IonicModule } from "@ionic/angular";
import { MenuComponent } from "./menu/menu.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { RouterModule } from "@angular/router";
import { NotificationComponent } from "./notification/notification.component";

export function customTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [HeaderComponent, MenuComponent, NotificationComponent],
  exports: [HeaderComponent, MenuComponent, RouterModule],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: customTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(),
    IonicStorageModule.forRoot()
  ]
})
export class ComponentsModule {}
