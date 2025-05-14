import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Schedule, ScheduleFilter } from '../../models/schedule.model';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit {
  schedules: Schedule[] = [];
  filterForm: FormGroup;

  constructor(
    private scheduleService: ScheduleService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      id: [''],
      plate: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    const filter: ScheduleFilter = {
      id: this.filterForm.get('id')?.value || undefined,
      plate: this.filterForm.get('plate')?.value || undefined,
      startDate: this.filterForm.get('startDate')?.value || undefined,
      endDate: this.filterForm.get('endDate')?.value || undefined
    };

    this.scheduleService.getSchedules(filter).subscribe(data => {
      this.schedules = data;
    });
  }

  searchSchedules(): void {
    this.loadSchedules();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadSchedules();
  }

  importSchedules(): void {
    // En una implementación real, abriríamos un diálogo para importar archivo
    console.log('Importando programaciones...');
  }

  viewDetails(id: string): void {
    // En una implementación real, navegar al detalle de la programación
    console.log(`Ver detalles de la programación ${id}`);
  }
}