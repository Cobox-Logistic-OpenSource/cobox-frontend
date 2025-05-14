// mileage-management.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { mileageManagementRoutes } from './mileage-management-routes';
import { MileageRecordListComponent } from './components/mileage-record-list/mileage-record-list.component';
import { MileageRecordFormComponent } from './components/mileage-record-form/mileage-record-form.component';
import { MileageRecordDetailComponent } from './components/mileage-record-detail/mileage-record-detail.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(mileageManagementRoutes),
    MileageRecordListComponent,
    MileageRecordDetailComponent,
    MileageRecordFormComponent
  ],
  providers: []
})
export class MileageManagementModule { }
