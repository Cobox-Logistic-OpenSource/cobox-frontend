import { Component } from '@angular/core';
                              import { CommonModule } from '@angular/common';
                              import { RouterModule } from '@angular/router';
                              import { FuelRecord } from '../../models/fuel-record.model';

                              @Component({
                                selector: 'app-fuel-record-list',
                                standalone: true,
                                imports: [CommonModule, RouterModule],
                                template: `
                                  <div class="header">
                                    <h1>Registros de Combustible</h1>
                                    <button routerLink="/fuel-management/new" class="btn btn-primary">Nuevo Registro</button>
                                  </div>
                                  <div class="filters">
                                    <input type="date" placeholder="Desde" class="input" />
                                    <input type="date" placeholder="Hasta" class="input" />
                                    <input type="text" placeholder="Placa del Vehículo" class="input" />
                                    <button class="btn btn-secondary">Filtrar</button>
                                    <button class="btn btn-secondary">Limpiar</button>
                                  </div>
                                  <table class="table">
                                    <thead>
                                      <tr>
                                        <th>Fecha</th>
                                        <th>Vehículo</th>
                                        <th>Tipo</th>
                                        <th>Cantidad</th>
                                        <th>Costo</th>
                                        <th>Acciones</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr *ngFor="let record of records">
                                        <td>{{ record.date }}</td>
                                        <td>{{ record.vehicle }}</td>
                                        <td>{{ record.type }}</td>
                                        <td>{{ record.quantity }}</td>
                                        <td>{{ record.cost }}</td>
                                        <td>
                                          <button routerLink="/fuel-management/detail/{{ record.id }}" class="btn btn-info">Ver</button>
                                          <button routerLink="/fuel-management/edit/{{ record.id }}" class="btn btn-warning">Editar</button>
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
                                  .filters {
                                    display: flex;
                                    gap: 10px;
                                    margin-bottom: 20px;
                                  }
                                  .input {
                                    padding: 5px;
                                    border: 1px solid #ccc;
                                    border-radius: 4px;
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
                                  .btn-secondary {
                                    background-color: #6c757d;
                                    color: white;
                                  }
                                  .btn-info {
                                    background-color: #17a2b8;
                                    color: white;
                                  }
                                  .btn-warning {
                                    background-color: #ffc107;
                                    color: black;
                                  }
                                  .btn-danger {
                                    background-color: #dc3545;
                                    color: white;
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
                                    background-color: #007bff;
                                    color: white;
                                  }
                                `],
                              })
                              export class FuelRecordListComponent {
                                records: FuelRecord[] = [
                                  { id: 1, date: '2023-01-01', vehicle: 'Carro 1', type: 'Gasolina', quantity: 10, cost: 500, mileage: 1000, station: 'Estación 1', location: 'Ciudad 1', notes: 'Sin observaciones' },
                                  { id: 2, date: '2023-01-02', vehicle: 'Carro 2', type: 'Diesel', quantity: 20, cost: 1000, mileage: 2000, station: 'Estación 2', location: 'Ciudad 2', notes: 'Revisar consumo' },
                                ];

                                deleteRecord(id: number) {
                                  this.records = this.records.filter(record => record.id !== id);
                                }
                              }
