import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MileageRecord } from '../../models/mileage-record.model';
import { MileagePurpose } from '../../models/mileage-purpose.enum';
import { MileageRecordService } from '../../services/mileage-record.service';
import { MileageUIService } from '../../services/mileage-ui.service';

@Component({
  selector: 'app-mileage-record-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './mileage-record-list.component.html',
  styleUrls: ['./mileage-record-list.component.css']
})
export class MileageRecordListComponent implements OnInit, OnDestroy {
  mileageRecords: MileageRecord[] = [];
  loading = false;
  error = false;
  errorMessage = '';

  startDate: string = '';
  endDate: string = '';
  vehicleId: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private mileageRecordService: MileageRecordService,
    private router: Router,
    public mileageUI: MileageUIService
  ) {}

  ngOnInit(): void {
    this.loadMileageRecords();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMileageRecords(): void {
    this.loading = true;
    this.mileageRecordService.getMileageRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (records) => {
          this.mileageRecords = records;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading mileage records', error);
          this.error = true;
          this.errorMessage = 'Error cargando registros de kilometraje';
          this.loading = false;
        }
      });
  }

  filter(): void {
    this.loading = true;
    this.mileageRecordService.getMileageRecords(this.startDate, this.endDate, this.vehicleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (records) => {
          this.mileageRecords = records;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering mileage records', error);
          this.error = true;
          this.errorMessage = 'Error filtrando registros de kilometraje';
          this.loading = false;
        }
      });
  }

  resetFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.vehicleId = '';
    this.loadMileageRecords();
  }

  viewDetails(recordId: string): void {
    this.router.navigate(['/mileage', recordId]);
  }

  createRecord(): void {
    this.router.navigate(['/mileage/new']);
  }

  editRecord(recordId: string): void {
    this.router.navigate(['/mileage', recordId, 'edit']);
  }

  deleteRecord(recordId: string): void {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.mileageRecordService.deleteMileageRecord(recordId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadMileageRecords();
          },
          error: (error) => {
            console.error('Error deleting mileage record', error);
            alert('Error al eliminar el registro de kilometraje');
          }
        });
    }
  }

  getPurposeClass(purpose: MileagePurpose): string {
    switch (purpose) {
      case MileagePurpose.DELIVERY:
        return 'purpose-delivery';
      case MileagePurpose.PICKUP:
        return 'purpose-pickup';
      case MileagePurpose.MAINTENANCE:
        return 'purpose-maintenance';
      case MileagePurpose.TRANSFER:
        return 'purpose-transfer';
      case MileagePurpose.OTHER:
        return 'purpose-other';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}