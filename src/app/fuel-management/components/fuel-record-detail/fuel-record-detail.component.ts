import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuelRecord } from '../../models/fuel-record.model';
import { FuelRecordService } from '../../services/fuel-record.service';
import { FuelUiService } from '../../services/fuel-ui.service';
import { FuelType } from '../../models/fuel-type.enum';

@Component({
  selector: 'app-fuel-record-detail',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  template: `
    <div class="detail-container">
      <h1>Detalles de Registro de Combustible</h1>

      <div *ngIf="loading" class="loading">
        Cargando datos...
      </div>

      <div *ngIf="!loading && !isEditing && record">
        <div class="record-detail">
          <p><strong>Vehículo:</strong> {{ record.vehiclePlate }} (ID: {{ record.vehicleId }})</p>
          <p><strong>Fecha:</strong> {{ record.date | date:'dd/MM/yyyy' }}</p>
          <p><strong>Tipo de Combustible:</strong> {{ record.fuelType }}</p>
          <p><strong>Cantidad:</strong> {{ record.quantity | number:'1.2-2' }} litros</p>
          <p><strong>Costo Total:</strong> {{ record.totalCost | currency:'PEN':'symbol':'1.2-2' }}</p>
          <p><strong>Kilometraje:</strong> {{ record.currentMileage | number }} km</p>

          <div *ngIf="record.previousMileage">
            <p><strong>Kilometraje Anterior:</strong> {{ record.previousMileage | number }} km</p>
            <p><strong>Distancia Recorrida:</strong> {{ record.distance | number }} km</p>
            <p><strong>Eficiencia:</strong> {{ record.efficiency ? (record.efficiency | number:'1.2-2') + ' km/l' : 'N/A' }}</p>
          </div>

          <p><strong>Estación:</strong> {{ record.station }}</p>
          <p><strong>Ubicación:</strong> {{ record.location }}</p>
          <p><strong>N° Factura:</strong> {{ record.invoiceNumber }}</p>
          <p><strong>Notas:</strong> {{ record.notes }}</p>
        </div>
      </div>

      <div *ngIf="!loading && isEditing && record">
        <form [formGroup]="recordForm" (ngSubmit)="saveChanges()" class="edit-form">
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
            <input formControlName="station"/>
          </div>

          <div class="form-group">
            <label>Ubicación:</label>
            <input formControlName="location"/>
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
            <button type="button" (click)="cancelEdit()" class="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>

      <div *ngIf="!loading && !isEditing" class="actions">
        <button (click)="toggleEdit()" class="btn btn-warning">Editar</button>
        <button (click)="goBack()" class="btn btn-secondary">Volver</button>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .loading {
      padding: 20px;
      text-align: center;
    }

.record-detail p {
      margin-bottom: 10px;
      padding: 8px;
      background-color: #f0f0f0;
      border-radius: 4px;
    }

    .actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }

    .edit-form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
    }

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

    .btn {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-warning {
      background-color: #ffc107;
      color: #212529;
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
  `],
})
export class FuelRecordDetailComponent implements OnInit {
  record: FuelRecord | null = null;
  isEditing = false;
  loading = false;
  recordForm: FormGroup;
  fuelTypes = Object.values(FuelType);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fuelRecordService: FuelRecordService,
    private uiService: FuelUiService,
    private fb: FormBuilder
  ) {
    this.recordForm = this.createForm();
  }

  ngOnInit(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadRecord(id);
    } else {
      this.loading = false;
      this.uiService.showError('ID de registro no válido');
      this.goBack();
    }
  }

  loadRecord(id: number): void {
    this.fuelRecordService.getRecordById(id).subscribe({
      next: (data) => {
        this.record = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.goBack();
      }
    });
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

  toggleEdit(): void {
    this.isEditing = true;

    if (this.record) {
      // Format date for input type="date"
      const dateStr = this.record.date.toISOString().split('T')[0];

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
    }
  }

  saveChanges(): void {
    if (this.recordForm.valid && this.record) {
      const formValue = this.recordForm.value;

      // Convert date string to Date object if needed
      const dateValue = formValue.date instanceof Date ?
        formValue.date : new Date(formValue.date);

      const updatedRecord: FuelRecord = {
        ...this.record,
        ...formValue,
        date: dateValue
      };

      this.fuelRecordService.updateRecord(this.record.id, updatedRecord).subscribe({
        next: (updatedData) => {
          this.record = updatedData;
          this.isEditing = false;
          this.uiService.showSuccess('Registro actualizado exitosamente');
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

  cancelEdit(): void {
    this.isEditing = false;
    this.recordForm.reset();
  }

  goBack(): void {
    this.router.navigate(['/fuel-management']);
  }
}
