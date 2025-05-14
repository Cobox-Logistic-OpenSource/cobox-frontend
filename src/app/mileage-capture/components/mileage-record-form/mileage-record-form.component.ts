import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MileageRecord, MileagePurpose } from '../../models/mileage-record.model';
import { MileageRecordService } from '../../services/mileage-record.service';

@Component({
  selector: 'app-mileage-record-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './mileage-record-form.component.html',
  styleUrls: ['./mileage-record-form.component.css']
})
export class MileageRecordFormComponent implements OnInit, OnDestroy {
  recordForm!: FormGroup;
  isEditMode = false;
  recordId: string | null = null;
  loading = false;
  saving = false;
  error = false;
  errorMessage = '';

  purposeOptions = Object.values(MileagePurpose);

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mileageRecordService: MileageRecordService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.recordId = params.get('id');

      if (this.recordId && this.recordId !== 'new') {
        this.isEditMode = true;
        this.loadRecordData(this.recordId);
      }
    });

    // Auto-calculate distance when start or end odometer changes
    this.recordForm.get('startOdometer')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateDistance());

    this.recordForm.get('endOdometer')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateDistance());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.recordForm = this.fb.group({
      vehicleId: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      startOdometer: ['', [Validators.required, Validators.min(0)]],
      endOdometer: ['', [Validators.required, Validators.min(0)]],
      distance: [{ value: '', disabled: true }],
      purpose: [MileagePurpose.DELIVERY, Validators.required],
      driverId: [''],
      route: [''],
      notes: ['']
    });
  }

  loadRecordData(id: string): void {
    this.loading = true;
    this.mileageRecordService.getMileageRecordById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (record) => {
          // Format date for HTML date input
          const formattedDate = record.date.toISOString().split('T')[0];

          this.recordForm.patchValue({
            vehicleId: record.vehicleId,
            date: formattedDate,
            startOdometer: record.startOdometer,
            endOdometer: record.endOdometer,
            distance: record.distance,
            purpose: record.purpose,
            driverId: record.driverId || '',
            route: record.route || '',
            notes: record.notes || ''
          });

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

  calculateDistance(): void {
    const startOdometer = this.recordForm.get('startOdometer')?.value;
    const endOdometer = this.recordForm.get('endOdometer')?.value;

    if (startOdometer && endOdometer && endOdometer >= startOdometer) {
      const distance = endOdometer - startOdometer;
      this.recordForm.get('distance')?.setValue(distance);
    } else {
      this.recordForm.get('distance')?.setValue('');
    }
  }

  onSubmit(): void {
    if (this.recordForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.recordForm.controls).forEach(key => {
        const control = this.recordForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.saving = true;
    const formData = this.recordForm.value;

    // Calculate distance if not already set
    const startOdometer = formData.startOdometer;
    const endOdometer = formData.endOdometer;
    const distance = endOdometer - startOdometer;

    const recordData: MileageRecord = {
      ...formData,
      distance: distance,
      date: new Date(formData.date),
      createdBy: 'ADMIN',
      createdAt: new Date()
    };

    if (this.isEditMode && this.recordId) {
      this.mileageRecordService.updateMileageRecord(this.recordId, recordData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.saving = false;
            this.router.navigate(['/mileage']);
          },
          error: (error) => {
            console.error('Error updating mileage record', error);
            this.saving = false;
            this.error = true;
            this.errorMessage = 'Error actualizando registro de kilometraje';
          }
        });
    } else {
      this.mileageRecordService.createMileageRecord(recordData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.saving = false;
            this.router.navigate(['/mileage']);
          },
          error: (error) => {
            console.error('Error creating mileage record', error);
            this.saving = false;
            this.error = true;
            this.errorMessage = 'Error creando registro de kilometraje';
          }
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/mileage']);
  }
}
