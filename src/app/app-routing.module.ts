import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dice',
    loadComponent: () => import('./dice/dice.page').then(m => m.DicePage)
  },
  {
    path: '',
    redirectTo: 'dice',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dice'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
