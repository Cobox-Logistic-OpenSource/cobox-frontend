import { Routes } from '@angular/router';
import { VehicleListComponent } from './fleet-management/components/vehicle-list/vehicle-list.component';
import { VehicleDetailComponent } from './fleet-management/components/vehicle-detail/vehicle-detail.component';
import { VehicleFormComponent } from './fleet-management/components/vehicle-form/vehicle-form.component';
import { MileageRecordListComponent } from './mileage-capture/components/mileage-record-list/mileage-record-list.component';
import { MileageRecordDetailComponent } from './mileage-capture/components/mileage-record-detail/mileage-record-detail.component';
import { MileageRecordFormComponent } from './mileage-capture/components/mileage-record-form/mileage-record-form.component';
import { FuelRecordListComponent } from './fuel-management/components/fuel-record-list/fuel-record-list.component';
import { FuelRecordFormComponent } from './fuel-management/components/fuel-record-form/fuel-record-form.component';
import { FuelRecordDetailComponent } from './fuel-management/components/fuel-record-detail/fuel-record-detail.component';

// Importar los nuevos componentes
import { ServiceListComponent } from './services-module/components/service-list/service-list.component';
import { FuelRecordSummaryListComponent } from './records-module/components/fuel-record-summary-list/fuel-record-summary-list.component';
import { ScheduleListComponent } from './management-module/components/schedule-list/schedule-list.component';
import { UserListComponent } from './users-module/components/user-list/user-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/fleet', pathMatch: 'full' },
  
  // Rutas existentes
  { path: 'fleet', component: VehicleListComponent },
  { path: 'fleet/new', component: VehicleFormComponent },
  { path: 'fleet/:id', component: VehicleDetailComponent },
  { path: 'fleet/:id/edit', component: VehicleFormComponent },
  
  { path: 'mileage', component: MileageRecordListComponent },
  { path: 'mileage/new', component: MileageRecordFormComponent },
  { path: 'mileage/:id', component: MileageRecordDetailComponent },
  { path: 'mileage/:id/edit', component: MileageRecordFormComponent },
  
  { path: 'fuel-management', children: [
    { path: '', component: FuelRecordListComponent },
    { path: 'new', component: FuelRecordFormComponent },
    { path: ':id', component: FuelRecordDetailComponent },
    { path: ':id/edit', component: FuelRecordFormComponent }
  ]},
  
  // Nuevas rutas
  { path: 'servicios', component: ServiceListComponent },
  { path: 'registros', component: FuelRecordSummaryListComponent },
  { path: 'gestion', component: ScheduleListComponent },
  { path: 'usuarios', component: UserListComponent },
  
  // Redirecciones
  { path: 'fuel', redirectTo: 'fuel-management', pathMatch: 'full' },
  { path: 'fuel/new', redirectTo: 'fuel-management/new', pathMatch: 'full' },
  { path: 'fuel/:id', redirectTo: 'fuel-management/:id', pathMatch: 'prefix' },
  { path: 'fuel/:id/edit', redirectTo: 'fuel-management/:id/edit', pathMatch: 'prefix' },
];