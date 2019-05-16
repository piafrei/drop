import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'home/add-drop', loadChildren: './pages/add-drop/add-drop.module#AddDropPageModule' },
  // { path: 'drop-detail/:id', loadChildren: './pages/drop-detail/drop-detail.module#DropDetailPage' },
  { path: 'detail/:id', loadChildren: './pages/add-drop/add-drop.module#AddDropPageModule' },
  { path: 'home/new-drop', loadChildren: './pages/add-drop/add-drop.module#AddDropPageModule' },
  { path: 'home/filter', loadChildren: './pages/filter/filter.module#FilterPageModule' },
  { path: 'home/notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },
  { path: 'home/settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'home/account', loadChildren: './pages/account/account.module#AccountPageModule' },
  { path: 'drop/:id', loadChildren: './pages/drop/drop.module#DropPageModule' },
  { path: 'home/settings/about', loadChildren: './pages/settings/about/about.module#AboutPageModule' },
  { path: 'home/settings/impressum', loadChildren: './pages/settings/impressum/impressum.module#ImpressumPageModule' },
  { path: 'home/settings/privacy', loadChildren: './pages/settings/privacy/privacy.module#PrivacyPageModule' },
  { path: 'home/settings/termsofuse', loadChildren: './pages/settings/termsofuse/termsofuse.module#TermsofusePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
