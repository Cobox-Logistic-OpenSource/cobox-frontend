import { Component } from '@angular/core';
            import { CommonModule } from '@angular/common';

            @Component({
              selector: 'app-fuel-record-form',
              standalone: true,
              imports: [CommonModule],
              template: `
                <form>
                  <label for="vehicle">Vehículo:</label>
                  <select id="vehicle">
                    <option *ngFor="let vehicle of vehicles" [value]="vehicle">{{ vehicle }}</option>
                  </select>
                </form>
              `,
            })
            export class FuelRecordFormComponent {
              vehicles = ['Carro 1', 'Carro 2', 'Carro 3']; // Ejemplo de datos
            }
