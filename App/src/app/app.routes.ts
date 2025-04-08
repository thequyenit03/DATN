import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./containers/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '',
    loadChildren: () => import('./containers/client/client.module').then((m) => m.ClientModule),
  },
];
