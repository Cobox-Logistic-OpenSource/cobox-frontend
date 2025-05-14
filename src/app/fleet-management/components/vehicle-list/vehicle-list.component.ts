import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Vehicle } from '../../models/vehicle.model';
import { VehicleType, VehicleStatus } from '../../models/vehicle-type.enum';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleUIService } from '../../services/vehicle-ui.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnDestroy {
  allVehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  vehicleStatusEnum = VehicleStatus;
  vehicleTypeEnum = VehicleType;
  
  // Paginación
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  
  private filterValue = '';
  private destroy$ = new Subject<void>();

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
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
          this.allVehicles = vehicles;
          this.applyFilterAndPagination();
        },
        error: error => console.error('Error loading vehicles', error)
      });
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 1; // Reset to first page when filtering
    this.applyFilterAndPagination();
  }

  applyFilterAndPagination(): void {
    // Apply filter
    if (this.filterValue) {
      this.filteredVehicles = this.allVehicles.filter(vehicle => {
        return vehicle.plate.toLowerCase().includes(this.filterValue) ||
               vehicle.brand.toLowerCase().includes(this.filterValue) ||
               vehicle.model.toLowerCase().includes(this.filterValue);
      });
    } else {
      this.filteredVehicles = [...this.allVehicles];
    }
    
    // Calculate total pages
    this.totalPages = Math.ceil(this.filteredVehicles.length / this.pageSize);
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredVehicles = this.filteredVehicles.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilterAndPagination();
    }
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // If total pages is less than or equal to max, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page, last page, current page, and one page before and after current
      let startPage = Math.max(1, this.currentPage - 1);
      let endPage = Math.min(this.totalPages, this.currentPage + 1);
      
      // Adjust if we are at the beginning or end
      if (startPage === 1) {
        endPage = 3;
      } else if (endPage === this.totalPages) {
        startPage = this.totalPages - 2;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add first page if not included
      if (startPage > 1) {
        pages.unshift(1);
      }
      
      // Add last page if not included
      if (endPage < this.totalPages) {
        pages.push(this.totalPages);
      }
    }
    
    return pages;
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
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
      this.vehicleService.deleteVehicle(vehicleId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadVehicles();
          },
          error: error => console.error('Error deleting vehicle', error)
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

