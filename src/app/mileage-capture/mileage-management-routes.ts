// mileage-management-routes.ts
import { Routes } from '@angular/router';
import { MileageRecordListComponent } from './components/mileage-record-list/mileage-record-list.component';
import { MileageRecordFormComponent } from './components/mileage-record-form/mileage-record-form.component';
import { MileageRecordDetailComponent } from './components/mileage-record-detail/mileage-record-detail.component';

export const mileageManagementRoutes: Routes = [
  {
    path: '',
    component: MileageRecordListComponent
  },
  {
    path: 'new',
    component: MileageRecordFormComponent
  },
  {
    path: ':id',
    component: MileageRecordDetailComponent
  },
  {
    path: ':id/edit',
    component: MileageRecordFormComponent
  }
];
