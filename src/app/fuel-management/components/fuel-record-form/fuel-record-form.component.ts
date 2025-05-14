import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuelRecord } from '../../models/fuel-record.model';
import { FuelType } from '../../models/fuel-type.enum';

@Component({
  selector: 'app-fuel-record-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="recordForm" (ngSubmit)="submitForm()" class="fuel-record-form">
      <div class="form-group">
        <label for="vehicleId">ID del Vehículo:</label>
        <input id="vehicleId" formControlName="vehicleId" type="number" required/>
        <div *ngIf="recordForm.get('vehicleId')?.errors?.['required'] && recordForm.get('vehicleId')?.touched" class="error">
          Vehículo es requerido
        </div>
      </div>

      <div class="form-group">
        <label for="vehiclePlate">Placa:</label>
        <input id="vehiclePlate" formControlName="vehiclePlate" required/>
      </div>

      <div class="form-group">
        <label for="date">Fecha:</label>
        <input id="date" formControlName="date" type="date" required/>
        <div *ngIf="recordForm.get('date')?.errors?.['required'] && recordForm.get('date')?.touched" class="error">
          Fecha es requerida
        </div>
      </div>

      <div class="form-group">
        <label for="fuelType">Tipo de Combustible:</label>
        <select id="fuelType" formControlName="fuelType" required>
          <option *ngFor="let type of fuelTypes" [value]="type">{{ type }}</option>
        </select>
        <div *ngIf="recordForm.get('fuelType')?.errors?.['required'] && recordForm.get('fuelType')?.touched" class="error">
          Tipo de combustible es requerido
        </div>
      </div>

      <div class="form-group">
        <label for="quantity">Cantidad (litros):</label>
        <input id="quantity" formControlName="quantity" type="number" step="0.01" required/>
        <div *ngIf="recordForm.get('quantity')?.errors?.['required'] && recordForm.get('quantity')?.touched" class="error">
          Cantidad es requerida
        </div>
      </div>

      <div class="form-group">
        <label for="totalCost">Costo Total:</label>
        <input id="totalCost" formControlName="totalCost" type="number" step="0.01" required/>
        <div *ngIf="recordForm.get('totalCost')?.errors?.['required'] && recordForm.get('totalCost')?.touched" class="error">
          Costo es requerido
        </div>
      </div>

      <div class="form-group">
        <label for="currentMileage">Kilometraje Actual:</label>
        <input id="currentMileage" formControlName="currentMileage" type="number" required/>
        <div *ngIf="recordForm.get('currentMileage')?.errors?.['required'] && recordForm.get('currentMileage')?.touched" class="error">
          Kilometraje es requerido
        </div>
      </div>

      <div class="form-group">
        <label for="station">Estación:</label>
        <input id="station" formControlName="station"/>
      </div>

      <div class="form-group">
        <label for="location">Ubicación:</label>
        <input id="location" formControlName="location"/>
      </div>

      <div class="form-group">
        <label for="invoiceNumber">N° Factura:</label>
        <input id="invoiceNumber" formControlName="invoiceNumber"/>
      </div>

      <div class="form-group">
        <label for="notes">Notas:</label>
        <textarea id="notes" formControlName="notes"></textarea>
      </div>

      <div class="actions">
        <button type="submit" [disabled]="recordForm.invalid" class="btn btn-success">{{ submitLabel }}</button>
        <button type="button" (click)="cancel.emit()" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`

    .form-group label {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .form-group input, .form-group textarea, .form-group select {
      width: 100%;
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
      margin-top: 10px;
    }

    .btn {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-success {
      background-color: #28a745;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class FuelRecordFormComponent implements OnInit {
  @Input() record: FuelRecord | null = null;
  @Input() submitLabel = 'Guardar';
  @Output() save = new EventEmitter<FuelRecord>();
  @Output() cancel = new EventEmitter<void>();

  recordForm: FormGroup;
  fuelTypes = Object.values(FuelType);

  constructor(private fb: FormBuilder) {
    this.recordForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.record) {
      // Format date for input type="date"
      const dateStr = this.record.date instanceof Date ?
        this.record.date.toISOString().split('T')[0] :
        new Date(this.record.date).toISOString().split('T')[0];

      this.recordForm.patchValue({
        vehicleId: this.record.vehicleId,
        vehiclePlate: this.record.vehiclePlate,
        date: dateStr,
        fuelType: this.record.fuelType,
        quantity: this.record.quantity,
        totalCost: this.record.totalCost,
        currentMileage: this.record.currentMileage,
        station: this.record.station,
        location: this.record.location,
        invoiceNumber: this.record.invoiceNumber,
        notes: this.record.notes
      });
    } else {
      // Set default date to today
      this.recordForm.patchValue({
        date: new Date().toISOString().split('T')[0]
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      vehicleId: ['', Validators.required],
      vehiclePlate: ['', Validators.required],
      date: ['', Validators.required],
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

  submitForm(): void {
    if (this.recordForm.valid) {
      const formValue = this.recordForm.value;

      // Convert date string to Date object
      const dateValue = formValue.date instanceof Date ?
        formValue.date : new Date(formValue.date);

      const fuelRecord: FuelRecord = {
        id: this.record?.id || 0,
        vehicleId: formValue.vehicleId,
        vehiclePlate: formValue.vehiclePlate,
        date: dateValue,
        fuelType: formValue.fuelType,
        quantity: formValue.quantity,
        totalCost: formValue.totalCost,
        currentMileage: formValue.currentMileage,
        station: formValue.station,
        location: formValue.location,
        invoiceNumber: formValue.invoiceNumber,
        notes: formValue.notes
      };

      this.save.emit(fuelRecord);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.recordForm.controls).forEach(key => {
        const control = this.recordForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
