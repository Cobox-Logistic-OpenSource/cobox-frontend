import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FuelRecordSummary, FuelRecordFilter } from '../../models/fuel-record-summary.model';
import { FuelRecordSummaryService } from '../../services/fuel-record-summary.service';

@Component({
  selector: 'app-fuel-record-summary-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './fuel-record-summary-list.component.html',
  styleUrls: ['./fuel-record-summary-list.component.css']
})
export class FuelRecordSummaryListComponent implements OnInit {
  fuelRecordSummaries: FuelRecordSummary[] = [];
  filterForm: FormGroup;

  constructor(
    private fuelRecordSummaryService: FuelRecordSummaryService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      serviceId: [''],
      plate: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    const filter: FuelRecordFilter = {
      serviceId: this.filterForm.get('serviceId')?.value || undefined,
      plate: this.filterForm.get('plate')?.value || undefined,
      startDate: this.filterForm.get('startDate')?.value || undefined,
      endDate: this.filterForm.get('endDate')?.value || undefined
    };

    this.fuelRecordSummaryService.getFuelRecordSummaries(filter).subscribe(data => {
      this.fuelRecordSummaries = data;
    });
  }

  searchRecords(): void {
    this.loadRecords();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadRecords();
  }

  viewDetails(serviceId: string): void {
    // En una implementación real, añadiríamos navegación al detalle
    console.log(`Ver detalles del servicio ${serviceId}`);
  }

  exportToExcel(): void {
    this.fuelRecordSummaryService.exportToExcel().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registros-combustible.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}