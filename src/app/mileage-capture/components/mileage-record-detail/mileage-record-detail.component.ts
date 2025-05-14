import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MileageRecord } from '../../models/mileage-record.model';
import { MileageRecordService } from '../../services/mileage-record.service';
import { MileageUIService } from '../../services/mileage-ui.service';

@Component({
  selector: 'app-mileage-record-detail',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './mileage-record-detail.component.html',
  styleUrls: ['./mileage-record-detail.component.css']
})
export class MileageRecordDetailComponent implements OnInit, OnDestroy {
  mileageRecord: MileageRecord | null = null;
  loading = false;
  error = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private mileageRecordService: MileageRecordService,
    private route: ActivatedRoute,
    private router: Router,
    public mileageUI: MileageUIService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadMileageRecord(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMileageRecord(id: string): void {
    this.loading = true;
    this.mileageRecordService.getMileageRecordById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (record) => {
          this.mileageRecord = record;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading mileage record', error);
          this.error = true;
          this.errorMessage = 'Error cargando registro de kilometraje';
          this.loading = false;
        }
      });
  }

  editRecord(): void {
    if (this.mileageRecord) {
      this.router.navigate(['/mileage', this.mileageRecord.id, 'edit']);
    }
  }

  deleteRecord(): void {
    if (this.mileageRecord && confirm('¿Está seguro de eliminar este registro?')) {
      this.mileageRecordService.deleteMileageRecord(this.mileageRecord.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/mileage']);
          },
          error: (error) => {
            console.error('Error deleting mileage record', error);
            alert('Error al eliminar el registro de kilometraje');
          }
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/mileage']);
  }
}
