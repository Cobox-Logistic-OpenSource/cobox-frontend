// src/app/fleet-management/components/vehicle-detail/vehicle-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleType, VehicleStatus } from '../../models/vehicle-type.enum';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleUIService } from '../../services/vehicle-ui.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    DatePipe
  ],
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit, OnDestroy {
  vehicle: Vehicle = {} as Vehicle;
  loading = true;
  error = false;
  updating = false;
  vehicleStatusEnum = VehicleStatus;
  vehicleTypeEnum = VehicleType;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    public vehicleUI: VehicleUIService
  ) { }

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.paramMap.get('id');
    if (vehicleId) {
      this.loadVehicle(vehicleId);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVehicle(id: string): void {
    this.vehicleService.getVehicleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: vehicle => {
          this.vehicle = vehicle;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading vehicle', error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  editVehicle(): void {
    this.router.navigate(['/fleet', this.vehicle.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/fleet']);
  }

  updateStatus(newStatus: VehicleStatus): void {
    if (this.vehicle && !this.updating) {
      this.updating = true;
      this.vehicleService.updateVehicleStatus(this.vehicle.id, newStatus)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: updatedVehicle => {
            this.vehicle = updatedVehicle;
            this.updating = false;
          },
          error: error => {
            console.error(`Error updating vehicle status to ${newStatus}`, error);
            this.updating = false;
          }
        });
    }
  }

  getStatusClass(status: VehicleStatus): string {
    return this.vehicleUI.getStatusClass(status);
  }

  getVehicleTypeLabel(type: VehicleType): string {
    return this.vehicleUI.getVehicleTypeLabel(type);
  }

  getVehicleStatusLabel(status: VehicleStatus): string {
    return this.vehicleUI.getVehicleStatusLabel(status);
  }
}
