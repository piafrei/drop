import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'home/add-drop', loadChildren: './pages/add-drop/add-drop.module#AddDropPageModule' },
  { path: 'details/:id', loadChildren: './pages/add-drop/add-drop.module#AddDropPageModule' },
  { path: 'home/new-drop', loadChildren: './pages/add-drop/add-drop.module#AddDropPageModule' },
  { path: 'home/filter', loadChildren: './pages/filter/filter.module#FilterPageModule' },
  { path: 'home/notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },
  { path: 'home/settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'home/account', loadChildren: './pages/account/account.module#AccountPageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
