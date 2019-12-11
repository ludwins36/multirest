import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "inicio",
    loadChildren: "./pages/inicio/inicio.module#InicioPageModule"
  },
  {
    path: "register",
    loadChildren: "./pages/register/register.module#RegisterPageModule"
  },
  {
    path: "action-sheet",
    loadChildren:
      "./pages/action-sheet/action-sheet.module#ActionSheetPageModule"
  },
  { path: "login", loadChildren: "./pages/login/login.module#LoginPageModule" },
  { path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesPageModule' },
  { path: 'products', loadChildren: './pages/products/products.module#ProductsPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
