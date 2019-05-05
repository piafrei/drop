import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'add-drop', loadChildren: './pages/add-drop/add-drop.module#AddDropPageModule' },
  { path: 'new-drop/:id', loadChildren: './pages/add-drop/add-drop.module#AddDropPageModule' },
  { path: 'new-drop', loadChildren: './pages/add-drop/add-drop.module#AddDropPageModule' },
  { path: 'filter', loadChildren: './pages/filter/filter.module#FilterPageModule' },
  { path: 'notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'account', loadChildren: './pages/account/account.module#AccountPageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
