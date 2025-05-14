import { Component, Input } from '@angular/core';
                                       import { RouterModule } from '@angular/router';
                                       import { CommonModule } from '@angular/common';
                                       import { FuelRecord } from '../../models/fuel-record.model';

                                       @Component({
                                         selector: 'app-fuel-record-detail',
                                         standalone: true,
                                         imports: [RouterModule, CommonModule],
                                         template: `
                                           <div class="detail-container">
                                             <h1>Detalles de Registro de Combustible</h1>
                                             <div class="detail" *ngIf="!isEditing; else editMode">
                                               <p><strong>Vehículo:</strong> {{ record.vehicle }}</p>
                                               <p><strong>Fecha:</strong> {{ record.date }}</p>
                                               <p><strong>Tipo de Combustible:</strong> {{ record.type }}</p>
                                               <p><strong>Cantidad:</strong> {{ record.quantity }}</p>
                                               <p><strong>Costo:</strong> {{ record.cost }}</p>
                                               <p><strong>Kilometraje:</strong> {{ record.mileage }}</p>
                                               <p><strong>Estación:</strong> {{ record.station }}</p>
                                               <p><strong>Ubicación:</strong> {{ record.location }}</p>
                                               <p><strong>Notas:</strong> {{ record.notes }}</p>
                                             </div>
                                             <ng-template #editMode>
                                               <form>
                                                 <label>Vehículo:</label>
                                                 <input [value]="record.vehicle" (input)="updateRecord('vehicle', $event)" />
                                                 <label>Fecha:</label>
                                                 <input [value]="record.date" (input)="updateRecord('date', $event)" type="date" />
                                                 <label>Tipo de Combustible:</label>
                                                 <input [value]="record.type" (input)="updateRecord('type', $event)" />
                                                 <label>Cantidad:</label>
                                                 <input [value]="record.quantity" (input)="updateRecord('quantity', $event)" type="number" />
                                                 <label>Costo:</label>
                                                 <input [value]="record.cost" (input)="updateRecord('cost', $event)" type="number" />
                                                 <label>Kilometraje:</label>
                                                 <input [value]="record.mileage" (input)="updateRecord('mileage', $event)" type="number" />
                                                 <label>Estación:</label>
                                                 <input [value]="record.station" (input)="updateRecord('station', $event)" />
                                                 <label>Ubicación:</label>
                                                 <input [value]="record.location" (input)="updateRecord('location', $event)" />
                                                 <label>Notas:</label>
                                                 <textarea (input)="updateRecord('notes', $event)">{{ record.notes }}</textarea>
                                               </form>
                                             </ng-template>
                                             <div class="actions">
                                               <button *ngIf="!isEditing" (click)="toggleEdit()" class="btn btn-warning">Editar</button>
                                               <button *ngIf="isEditing" (click)="saveChanges()" class="btn btn-success">Guardar</button>
                                               <button *ngIf="isEditing" (click)="cancelEdit()" class="btn btn-secondary">Cancelar</button>
                                               <button routerLink="/fuel-management" class="btn btn-primary">Volver</button>
                                               <button (click)="deleteRecord(record.id)" class="btn btn-danger">Eliminar</button>
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
                                           .detail p, .detail label {
                                             margin: 5px 0;
                                           }
                                           .actions {
                                             margin-top: 20px;
                                             display: flex;
                                             gap: 10px;
                                           }
                                           .btn {
                                             padding: 8px 12px;
                                             border: none;
                                             border-radius: 4px;
                                             cursor: pointer;
                                           }
                                           .btn-primary {
                                             background-color: #007bff;
                                             color: white;
                                           }
                                           .btn-warning {
                                             background-color: #ffc107;
                                             color: black;
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
                                           input, textarea {
                                             display: block;
                                             width: 100%;
                                             margin-bottom: 10px;
                                             padding: 8px;
                                             border: 1px solid #ccc;
                                             border-radius: 4px;
                                           }
                                         `],
                                       })
                                       export class FuelRecordDetailComponent {
                                         @Input() record!: FuelRecord;
                                         isEditing = false;

                                         toggleEdit() {
                                           this.isEditing = true;
                                         }

                                         saveChanges() {
                                           this.isEditing = false;
                                         }

                                         cancelEdit() {
                                           this.isEditing = false;
                                         }

                                         deleteRecord(id: number) {
                                           // Lógica para eliminar un registro
                                         }

                                         updateRecord(field: string, event: Event) {
                                           const input = event.target as HTMLInputElement;
                                           (this.record as any)[field] = input.type === 'number' ? +input.value : input.value;
                                         }
                                       }
