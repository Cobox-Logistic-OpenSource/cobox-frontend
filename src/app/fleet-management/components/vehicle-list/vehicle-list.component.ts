// src/app/fleet-management/components/vehicle-list/vehicle-list.component.ts
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleType, VehicleStatus } from '../../models/vehicle-type.enum';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleUIService } from '../../services/vehicle-ui.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['plate', 'brand', 'model', 'type', 'status', 'currentMileage', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();
  vehicleStatusEnum = VehicleStatus;
  vehicleTypeEnum = VehicleType;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private dialog: MatDialog,
    public vehicleUI: VehicleUIService
  ) { }

  ngOnInit(): void {
    this.loadVehicles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: vehicles => {
          this.dataSource = new MatTableDataSource(vehicles);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // Add custom filter predicate to handle accented characters
          this.dataSource.filterPredicate = (data: Vehicle, filter: string) => {
            const normalizedFilter = filter.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

            // Usar Object.entries para tipado seguro
            return Object.entries(data).some(([_, value]) => {
              if (typeof value === 'string') {
                const normalizedValue = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                return normalizedValue.includes(normalizedFilter);
              }
              return false;
            });
          };
        },
        error: error => console.error('Error loading vehicles', error)
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewVehicleDetails(vehicleId: string): void {
    this.router.navigate(['/fleet', vehicleId]);
  }

  editVehicle(vehicleId: string): void {
    this.router.navigate(['/fleet', vehicleId, 'edit']);
  }

  addNewVehicle(): void {
    this.router.navigate(['/fleet/new']);
  }

  updateStatus(vehicleId: string, newStatus: VehicleStatus): void {
    this.vehicleService.updateVehicleStatus(vehicleId, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadVehicles();
        },
        error: error => console.error(`Error updating vehicle status to ${newStatus}`, error)
      });
  }

  deleteVehicle(vehicleId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: '¿Está seguro de eliminar este vehículo?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicleService.deleteVehicle(vehicleId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadVehicles();
            },
            error: error => console.error('Error deleting vehicle', error)
          });
      }
    });
  }

  getStatusClass(status: VehicleStatus): string {
    return this.vehicleUI.getStatusClass(status);
  }
}
