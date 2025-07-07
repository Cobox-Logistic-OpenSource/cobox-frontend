import { NgModule } from '@angular/core';
        import { RouterModule, Routes } from '@angular/router';
        import { FuelRecordListComponent } from './components/fuel-record-list/fuel-record-list.component';
        import { FuelRecordFormComponent } from './components/fuel-record-form/fuel-record-form.component';
        import { FuelRecordDetailComponent } from './components/fuel-record-detail/fuel-record-detail.component';

        const routes: Routes = [
          { path: '', component: FuelRecordListComponent },
          { path: 'new', component: FuelRecordFormComponent },
          { path: 'edit/:id', component: FuelRecordFormComponent },
          { path: 'detail/:id', component: FuelRecordDetailComponent },
        ];

        @NgModule({
          imports: [
            RouterModule.forChild(routes),
            FuelRecordListComponent,
            FuelRecordFormComponent,
            FuelRecordDetailComponent,
          ],
          exports: [RouterModule],
        })
        export class FuelManagementModule {}
