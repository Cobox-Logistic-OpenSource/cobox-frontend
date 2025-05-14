// src/app/fleet-management/components/vehicle-form/vehicle-form.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleType, VehicleStatus } from '../../models/vehicle-type.enum';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleUIService } from '../../services/vehicle-ui.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit, OnDestroy {
  vehicleForm: FormGroup;
  isEditMode = false;
  vehicleId: string | null = null;
  loading = false;
  error = false;
  errorMessage = '';
  submitting = false;
  currentYear: number = new Date().getFullYear();

  vehicleTypes = Object.values(VehicleType);
  vehicleStatuses = Object.values(VehicleStatus);
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    public vehicleUI: VehicleUIService
  ) {
    this.vehicleForm = this.fb.group({
      plate: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{5,10}$/)]],
      brand: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      model: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      year: ['', [Validators.required, Validators.min(1970), Validators.max(this.currentYear + 1)]],
      type: [VehicleType.TRUCK, Validators.required],
      loadCapacity: ['', [Validators.required, Validators.min(0)]],
      tankCapacity: ['', [Validators.required, Validators.min(0)]],
      status: [VehicleStatus.AVAILABLE, Validators.required],
      currentMileage: ['', [Validators.required, Validators.min(0)]],
      lastMaintenance: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id');
    if (this.vehicleId) {
      this.isEditMode = true;
      this.loadVehicleData(this.vehicleId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVehicleData(id: string): void {
    this.loading = true;

    this.vehicleService.getVehicleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: vehicle => {
          this.vehicleForm.patchValue({
            plate: vehicle.plate,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.type,
            loadCapacity: vehicle.loadCapacity,
            tankCapacity: vehicle.tankCapacity,
            status: vehicle.status,
            currentMileage: vehicle.currentMileage,
            lastMaintenance: vehicle.lastMaintenance ? this.formatDateForInput(vehicle.lastMaintenance) : '',
            active: vehicle.active
          });
          this.loading = false;
        },
        error: error => {
          console.error('Error loading vehicle data', error);
          this.error = true;
          this.errorMessage = 'No se pudo cargar la información del vehículo.';
          this.loading = false;
        }
      });
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid || this.submitting) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.loading = true;
    const vehicleData: Vehicle = this.prepareVehicleData();

    if (this.isEditMode && this.vehicleId) {
      this.vehicleService.updateVehicle(this.vehicleId, vehicleData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.submitting = false;
            this.router.navigate(['/fleet']);
          },
          error: error => {
            console.error('Error updating vehicle', error);
            this.error = true;
            this.errorMessage = 'Error al actualizar el vehículo. Inténtelo nuevamente.';
            this.loading = false;
            this.submitting = false;
          }
        });
    } else {
      this.vehicleService.createVehicle(vehicleData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.submitting = false;
            this.router.navigate(['/fleet']);
          },
          error: error => {
            console.error('Error creating vehicle', error);
            this.error = true;
            this.errorMessage = 'Error al crear el vehículo. Inténtelo nuevamente.';
            this.loading = false;
            this.submitting = false;
          }
        });
    }
  }

  prepareVehicleData(): Vehicle {
    const formValues = this.vehicleForm.value;
    const vehicle: Vehicle = {
      id: this.vehicleId || '',
      plate: formValues.plate,
      brand: formValues.brand,
      model: formValues.model,
      year: formValues.year,
      type: formValues.type,
      loadCapacity: formValues.loadCapacity,
      tankCapacity: formValues.tankCapacity,
      status: formValues.status,
      currentMileage: formValues.currentMileage,
      active: formValues.active
    };

    if (formValues.lastMaintenance) {
      vehicle.lastMaintenance = new Date(formValues.lastMaintenance);
    }

    return vehicle;
  }

  cancel(): void {
    this.router.navigate(['/fleet']);
  }

  getVehicleTypeLabel(type: VehicleType): string {
    return this.vehicleUI.getVehicleTypeLabel(type);
  }

  getVehicleStatusLabel(status: VehicleStatus): string {
    return this.vehicleUI.getVehicleStatusLabel(status);
  }

  // Form field getters
  get plateField() { return this.vehicleForm.get('plate'); }
  get brandField() { return this.vehicleForm.get('brand'); }
  get modelField() { return this.vehicleForm.get('model'); }
  get yearField() { return this.vehicleForm.get('year'); }
  get typeField() { return this.vehicleForm.get('type'); }
  get loadCapacityField() { return this.vehicleForm.get('loadCapacity'); }
  get tankCapacityField() { return this.vehicleForm.get('tankCapacity'); }
  get statusField() { return this.vehicleForm.get('status'); }
  get currentMileageField() { return this.vehicleForm.get('currentMileage'); }
  get lastMaintenanceField() { return this.vehicleForm.get('lastMaintenance'); }
  get activeField() { return this.vehicleForm.get('active'); }
}
