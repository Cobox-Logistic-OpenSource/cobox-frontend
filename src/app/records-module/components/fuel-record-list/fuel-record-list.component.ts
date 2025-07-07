import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuelRecordSummary, FuelRecordFilter } from '../../models/fuel-record-summary.model';
import { FuelRecordSummaryService } from '../../services/fuel-record-summary.service';

@Component({
  selector: 'app-fuel-record-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './fuel-record-list.component.html',
  styleUrls: ['./fuel-record-list.component.css']
})
export class FuelRecordListComponent implements OnInit {
  fuelRecordSummaries: FuelRecordSummary[] = [];
  filterForm: FormGroup;
  
  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

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
      this.totalPages = Math.ceil(data.length / this.pageSize);
    });
  }

  searchRecords(): void {
    this.currentPage = 1;
    this.loadRecords();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadRecords();
  }

  viewDetails(serviceId: string): void {
    // Implementar navegación al detalle del registro
    console.log(`Ver detalles del servicio ${serviceId}`);
  }

  exportToExcel(): void {
    // Implementar exportación a Excel
    console.log('Exportando a Excel...');
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}