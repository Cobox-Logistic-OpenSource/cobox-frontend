// src/app/app-routes.ts
import { Routes } from '@angular/router';
import { VehicleListComponent } from './fleet-management/components/vehicle-list/vehicle-list.component';
import { VehicleDetailComponent } from './fleet-management/components/vehicle-detail/vehicle-detail.component';
import { VehicleFormComponent } from './fleet-management/components/vehicle-form/vehicle-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/fleet', pathMatch: 'full' },
  { path: 'fleet', component: VehicleListComponent },
  { path: 'fleet/new', component: VehicleFormComponent },
  { path: 'fleet/:id', component: VehicleDetailComponent },
  { path: 'fleet/:id/edit', component: VehicleFormComponent },
  // Otras rutas...
];
