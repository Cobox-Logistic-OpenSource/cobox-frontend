import { Routes } from '@angular/router';
import {FuelRecordListComponent} from './fuel-management/components/fuel-record-list/fuel-record-list.component';
import {FuelRecordFormComponent} from './fuel-management/components/fuel-record-form/fuel-record-form.component';
import {FuelRecordDetailComponent} from './fuel-management/components/fuel-record-detail/fuel-record-detail.component';


export const routes: Routes = [

  // Fuel Management module routes
  {
    path: 'fuel-management',
    children: [
      { path: '', component: FuelRecordListComponent },
      { path: 'new', component: FuelRecordFormComponent },
      { path: ':id', component: FuelRecordDetailComponent },
      { path: ':id/edit', component: FuelRecordFormComponent }
    ]
  },

  // Legacy routes (keeping for compatibility)
  { path: 'fuel', redirectTo: 'fuel-management', pathMatch: 'full' },
  { path: 'fuel/new', redirectTo: 'fuel-management/new', pathMatch: 'full' },
  { path: 'fuel/:id', redirectTo: 'fuel-management/:id', pathMatch: 'prefix' },
  { path: 'fuel/:id/edit', redirectTo: 'fuel-management/:id/edit', pathMatch: 'prefix' },
];
