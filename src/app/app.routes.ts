import { Routes } from '@angular/router';
import { MileageRecordListComponent } from './mileage-capture/components/mileage-record-list/mileage-record-list.component';
import { MileageRecordDetailComponent } from './mileage-capture/components/mileage-record-detail/mileage-record-detail.component';
import { MileageRecordFormComponent } from './mileage-capture/components/mileage-record-form/mileage-record-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/mileage', pathMatch: 'full' },

  // Añade una ruta para 'fleet' que redireccione a 'mileage' temporalmente
  { path: 'fleet', redirectTo: '/mileage', pathMatch: 'full' },

  // Rutas de mileage
  { path: 'mileage', component: MileageRecordListComponent },
  { path: 'mileage/new', component: MileageRecordFormComponent },
  { path: 'mileage/:id', component: MileageRecordDetailComponent },
  { path: 'mileage/:id/edit', component: MileageRecordFormComponent },

];
