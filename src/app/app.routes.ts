import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'fuel-management',
    loadChildren: () =>
      import('./fuel-management/fuel-management.module').then(
        (m) => m.FuelManagementModule
      ),
  },
];
