import { Routes } from '@angular/router';
import { VehicleListComponent } from './fleet-management/components/vehicle-list/vehicle-list.component';
import { VehicleDetailComponent } from './fleet-management/components/vehicle-detail/vehicle-detail.component';
import { VehicleFormComponent } from './fleet-management/components/vehicle-form/vehicle-form.component';
import { MileageRecordListComponent } from './mileage-capture/components/mileage-record-list/mileage-record-list.component';
import { MileageRecordDetailComponent } from './mileage-capture/components/mileage-record-detail/mileage-record-detail.component';
import { MileageRecordFormComponent } from './mileage-capture/components/mileage-record-form/mileage-record-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/fleet', pathMatch: 'full' },

  // Añade una ruta para 'fleet' que redireccione a 'mileage' temporalmente
  { path: 'fleet', redirectTo: '/mileage', pathMatch: 'full' },
  { path: '', redirectTo: '/fleet', pathMatch: 'full' },
  { path: 'fleet', component: VehicleListComponent },
  { path: 'fleet/new', component: VehicleFormComponent },
  { path: 'fleet/:id', component: VehicleDetailComponent },
  { path: 'fleet/:id/edit', component: VehicleFormComponent },
  // Otras rutas...
  // Rutas de mileage
  { path: 'mileage', component: MileageRecordListComponent },
  { path: 'mileage/new', component: MileageRecordFormComponent },
  { path: 'mileage/:id', component: MileageRecordDetailComponent },
  { path: 'mileage/:id/edit', component: MileageRecordFormComponent },


];
