import { Routes } from '@angular/router';
  import { FuelRecordListComponent } from './components/fuel-record-list/fuel-record-list.component';
  import { FuelRecordFormComponent } from './components/fuel-record-form/fuel-record-form.component';
  import { FuelRecordDetailComponent } from './components/fuel-record-detail/fuel-record-detail.component';

  export const FUEL_MANAGEMENT_ROUTES: Routes = [
    {
      path: 'records',
      component: FuelRecordListComponent
    },
    {
      path: 'records/new',
      component: FuelRecordFormComponent
    },
    {
      path: 'records/:id',
      component: FuelRecordDetailComponent
    },
    {
      path: 'records/:id/edit',
      component: FuelRecordFormComponent
    },
    {
      path: '',
      redirectTo: 'records',
      pathMatch: 'full'
    }
  ];
