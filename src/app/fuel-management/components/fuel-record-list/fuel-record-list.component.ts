import { Component } from '@angular/core';
                           import { FormsModule } from '@angular/forms';
                           import { CommonModule } from '@angular/common';
                           import { FuelRecord } from '../../models/fuel-record.model';

                           @Component({
                             selector: 'app-fuel-record-list',
                             standalone: true,
                             imports: [CommonModule, FormsModule],
                             template: `
                               <div class="header">
                                 <h1>Lista de Registros de Combustible</h1>
                                 <button (click)="toggleNewRecordForm()" class="btn btn-primary">Nuevo Registro</button>
                               </div>
                               <div *ngIf="showNewRecordForm" class="form-container">
                                 <h2>Nuevo Registro</h2>
                                 <form (ngSubmit)="addNewRecord()" class="form">
                                   <div class="form-group">
                                     <label>Vehículo:</label>
                                     <input [(ngModel)]="newRecord.vehicle" name="vehicle" required />
                                   </div>
                                   <div class="form-group">
                                     <label>Fecha:</label>
                                     <input [(ngModel)]="newRecord.date" name="date" type="date" required />
                                   </div>
                                   <div class="form-group">
                                     <label>Tipo de Combustible:</label>
                                     <input [(ngModel)]="newRecord.type" name="type" required />
                                   </div>
                                   <div class="form-group">
                                     <label>Cantidad:</label>
                                     <input [(ngModel)]="newRecord.quantity" name="quantity" type="number" required />
                                   </div>
                                   <div class="form-group">
                                     <label>Costo:</label>
                                     <input [(ngModel)]="newRecord.cost" name="cost" type="number" required />
                                   </div>
                                   <div class="form-group">
                                     <label>Kilometraje:</label>
                                     <input [(ngModel)]="newRecord.mileage" name="mileage" type="number" required />
                                   </div>
                                   <div class="form-group">
                                     <label>Estación:</label>
                                     <input [(ngModel)]="newRecord.station" name="station" required />
                                   </div>
                                   <div class="form-group">
                                     <label>Ubicación:</label>
                                     <input [(ngModel)]="newRecord.location" name="location" required />
                                   </div>
                                   <div class="form-group">
                                     <label>Notas:</label>
                                     <textarea [(ngModel)]="newRecord.notes" name="notes"></textarea>
                                   </div>
                                   <div class="actions">
                                     <button type="submit" class="btn btn-success">Guardar</button>
                                     <button type="button" (click)="toggleNewRecordForm()" class="btn btn-secondary">Cancelar</button>
                                   </div>
                                 </form>
                               </div>
                               <table class="table">
                                 <thead>
                                   <tr>
                                     <th>Vehículo</th>
                                     <th>Fecha</th>
                                     <th>Tipo</th>
                                     <th>Cantidad</th>
                                     <th>Costo</th>
                                     <th>Kilometraje</th>
                                     <th>Acciones</th>
                                   </tr>
                                 </thead>
                                 <tbody>
                                   <tr *ngFor="let record of records">
                                     <td>{{ record.vehicle }}</td>
                                     <td>{{ record.date }}</td>
                                     <td>{{ record.type }}</td>
                                     <td>{{ record.quantity }}</td>
                                     <td>{{ record.cost }}</td>
                                     <td>{{ record.mileage }}</td>
                                     <td>
                                       <button (click)="deleteRecord(record.id)" class="btn btn-danger">Eliminar</button>
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
                               .form-group input, .form-group textarea {
                                 padding: 8px;
                                 border: 1px solid #ccc;
                                 border-radius: 4px;
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
                             `],
                           })
                           export class FuelRecordListComponent {
                             records: FuelRecord[] = [];
                             showNewRecordForm = false;
                             newRecord: FuelRecord = {
                               id: 0,
                               vehicle: '',
                               date: '',
                               type: '',
                               quantity: 0,
                               cost: 0,
                               mileage: 0,
                               station: '',
                               location: '',
                               notes: '',
                             };

                             toggleNewRecordForm() {
                               this.showNewRecordForm = !this.showNewRecordForm;
                               if (!this.showNewRecordForm) {
                                 this.resetNewRecord();
                               }
                             }

                             addNewRecord() {
                               const newId = this.records.length > 0 ? Math.max(...this.records.map(r => r.id)) + 1 : 1;
                               this.records.push({ ...this.newRecord, id: newId });
                               this.toggleNewRecordForm();
                             }

                             resetNewRecord() {
                               this.newRecord = {
                                 id: 0,
                                 vehicle: '',
                                 date: '',
                                 type: '',
                                 quantity: 0,
                                 cost: 0,
                                 mileage: 0,
                                 station: '',
                                 location: '',
                                 notes: '',
                               };
                             }

                             deleteRecord(id: number) {
                               this.records = this.records.filter(record => record.id !== id);
                             }
                           }
