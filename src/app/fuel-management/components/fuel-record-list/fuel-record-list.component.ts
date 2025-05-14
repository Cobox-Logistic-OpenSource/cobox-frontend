import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuelRecord, FuelRecordFilter } from '../../models/fuel-record.model';
import { FuelRecordService } from '../../services/fuel-record.service';
import { FuelUiService } from '../../services/fuel-ui.service';
import { FuelType } from '../../models/fuel-type.enum';

@Component({
  selector: 'app-fuel-record-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="header">
      <h1>Lista de Registros de Combustible</h1>
      <button (click)="toggleNewRecordForm()" class="btn btn-primary">Nuevo Registro</button>
    </div>

    <div *ngIf="loading" class="loading">
      Cargando registros...
    </div>

    <div *ngIf="showNewRecordForm" class="form-container">
      <h2>Nuevo Registro</h2>
      <form [formGroup]="recordForm" (ngSubmit)="addNewRecord()" class="form">
        <div class="form-group">
          <label>Vehículo ID:</label>
          <input formControlName="vehicleId" type="number" required/>
          <div *ngIf="recordForm.get('vehicleId')?.errors?.['required'] && recordForm.get('vehicleId')?.touched" class="error">
            Vehículo es requerido
          </div>
        </div>

        <div class="form-group">
          <label>Placa:</label>
          <input formControlName="vehiclePlate" required/>
        </div>

        <div class="form-group">
          <label>Fecha:</label>
          <input formControlName="date" type="date" required/>
          <div *ngIf="recordForm.get('date')?.errors?.['required'] && recordForm.get('date')?.touched" class="error">
            Fecha es requerida
          </div>
        </div>

        <div class="form-group">
          <label>Tipo de Combustible:</label>
          <select formControlName="fuelType" required>
            <option *ngFor="let type of fuelTypes" [value]="type">{{ type }}</option>
          </select>
          <div *ngIf="recordForm.get('fuelType')?.errors?.['required'] && recordForm.get('fuelType')?.touched" class="error">
            Tipo de combustible es requerido
          </div>
        </div>

        <div class="form-group">
          <label>Cantidad:</label>
          <input formControlName="quantity" type="number" step="0.01" required/>
          <div *ngIf="recordForm.get('quantity')?.errors?.['required'] && recordForm.get('quantity')?.touched" class="error">
            Cantidad es requerida
          </div>
        </div>

        <div class="form-group">
          <label>Costo Total:</label>
          <input formControlName="totalCost" type="number" step="0.01" required/>
          <div *ngIf="recordForm.get('totalCost')?.errors?.['required'] && recordForm.get('totalCost')?.touched" class="error">
            Costo es requerido
          </div>
        </div>

        <div class="form-group">
          <label>Kilometraje:</label>
          <input formControlName="currentMileage" type="number" required/>
          <div *ngIf="recordForm.get('currentMileage')?.errors?.['required'] && recordForm.get('currentMileage')?.touched" class="error">
            Kilometraje es requerido
          </div>
        </div>

        <div class="form-group">
          <label>Estación:</label>
          <input formControlName="station" required/>
        </div>

        <div class="form-group">
          <label>Ubicación:</label>
          <input formControlName="location" required/>
        </div>

        <div class="form-group">
          <label>N° Factura:</label>
          <input formControlName="invoiceNumber"/>
        </div>

        <div class="form-group">
          <label>Notas:</label>
          <textarea formControlName="notes"></textarea>
        </div>

        <div class="actions">
          <button type="submit" [disabled]="recordForm.invalid" class="btn btn-success">Guardar</button>
          <button type="button" (click)="toggleNewRecordForm()" class="btn btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>

    <div *ngIf="records.length === 0 && !loading" class="empty-state">
      No hay registros de combustible disponibles.
    </div>

    <table *ngIf="records.length > 0" class="table">
      <thead>
      <tr>
        <th>Vehículo</th>
        <th>Fecha</th>
        <th>Tipo</th>
        <th>Cantidad</th>
        <th>Costo</th>
        <th>Kilometraje</th>
        <th>Eficiencia</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let record of records">
        <td>{{ record.vehiclePlate }}</td>
        <td>{{ record.date | date:'dd/MM/yyyy' }}</td>
        <td>{{ record.fuelType }}</td>
        <td>{{ record.quantity | number:'1.2-2' }}</td>
        <td>{{ record.totalCost | currency:'PEN':'symbol':'1.2-2' }}</td>
        <td>{{ record.currentMileage | number }}</td>
        <td>{{ record.efficiency ? (record.efficiency | number:'1.2-2') + ' km/l' : 'N/A' }}</td>
        <td>
          <button (click)="viewRecord(record.id)" class="btn btn-info">Ver</button>
          <button (click)="confirmDeleteRecord(record.id)" class="btn btn-danger">Eliminar</button>
        </td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .loading, .empty-state {
      padding: 20px;
      text-align: center;
      background-color: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .form-container {
      margin-bottom: 20px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .form-group input, .form-group textarea, .form-group select {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .form-group .error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    .actions {
      grid-column: span 2;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th, .table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    .table th {
      background-color: #f4f4f4;
      font-weight: bold;
    }

    .btn {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-success {
      background-color: #28a745;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `],
})
export class FuelRecordListComponent implements OnInit {
  records: FuelRecord[] = [];
  showNewRecordForm = false;
  loading = false;
  recordForm: FormGroup;
  fuelTypes = Object.values(FuelType);

  constructor(
    private fuelRecordService: FuelRecordService,
    private uiService: FuelUiService,
    private fb: FormBuilder,
    private router: Router // Añadido Router
  ) {
    this.recordForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(filter?: FuelRecordFilter): void {
    this.loading = true;
    this.fuelRecordService.getRecords(filter).subscribe({
      next: (data) => {
        this.records = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      vehicleId: ['', Validators.required],
      vehiclePlate: ['', Validators.required],
      date: [new Date(), Validators.required],
      fuelType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.01)]],
      totalCost: ['', [Validators.required, Validators.min(0.01)]],
      currentMileage: ['', Validators.required],
      station: [''],
      location: [''],
      invoiceNumber: [''],
      notes: ['']
    });
  }

  toggleNewRecordForm(): void {
    this.showNewRecordForm = !this.showNewRecordForm;
    if (this.showNewRecordForm) {
      this.recordForm.reset();
      this.recordForm.patchValue({
        date: new Date().toISOString().split('T')[0]
      });
    }
  }

  addNewRecord(): void {
    if (this.recordForm.valid) {
      const formValue = this.recordForm.value;

      // Convert date string to Date object if needed
      const dateValue = formValue.date instanceof Date ?
        formValue.date : new Date(formValue.date);

      const newRecord: FuelRecord = {
        ...formValue,
        id: 0, // Will be assigned by the server
        date: dateValue
      };

      this.fuelRecordService.createRecord(newRecord).subscribe({
        next: () => {
          this.uiService.showSuccess('Registro creado exitosamente');
          this.toggleNewRecordForm();
          this.loadRecords(); // Reload the list
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.recordForm.controls).forEach(key => {
        const control = this.recordForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  viewRecord(id: number): void {
    // CAMBIO PRINCIPAL: Navegar a la vista de detalle en lugar de hacer console.log
    this.router.navigate(['/fuel-management', id]);
  }

  confirmDeleteRecord(id: number): void {
    this.uiService.showConfirmDialog(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este registro?'
    ).subscribe(confirmed => {
      if (confirmed) {
        this.deleteRecord(id);
      }
    });
  }

  deleteRecord(id: number): void {
    this.fuelRecordService.deleteRecord(id).subscribe({
      next: () => {
        this.uiService.showSuccess('Registro eliminado exitosamente');
        this.loadRecords(); // Reload the list
      }
    });
  }
}
