import { Routes } from '@angular/router';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';

export const FLEET_ROUTES: Routes = [
  {
    path: '',
    component: VehicleListComponent
  },
  {
    path: 'new',
    component: VehicleFormComponent
  },
  {
    path: ':id',
    component: VehicleDetailComponent
  },
  {
    path: ':id/edit',
    component: VehicleFormComponent
  }
];
