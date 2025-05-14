import { Injectable } from '@angular/core';
import { FuelRecord, FuelRecordFilter } from '../models/fuel-record.model';
import { FuelRecordExternalApiService } from './fuel-record-external-api.service';
import { Observable, map, switchMap, of, forkJoin } from 'rxjs';
import { FuelRecordMapper } from '../mappers/fuel-record.mapper';

@Injectable({
  providedIn: 'root'
})
export class FuelRecordInternalApiService {

  constructor(private externalApiService: FuelRecordExternalApiService) {}

  /**
   * Get all fuel records with calculated fields
   */
  getAll(filter?: FuelRecordFilter): Observable<FuelRecord[]> {
    return this.externalApiService.getAll(filter).pipe(
      map(records => {
        // Sort records by date (newest first)
        records.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Process records by vehicle to calculate efficiency
        const vehicleRecords: { [key: number]: FuelRecord[] } = {};

        // Group records by vehicle
        records.forEach(record => {
          if (!vehicleRecords[record.vehicleId]) {
            vehicleRecords[record.vehicleId] = [];
          }
          vehicleRecords[record.vehicleId].push(record);
        });

        // Calculate efficiency for each vehicle's records
        const enhancedRecords: FuelRecord[] = [];

        Object.values(vehicleRecords).forEach(vehicleGroup => {
          // Sort by date (oldest first) for calculation
          vehicleGroup.sort((a, b) => a.date.getTime() - b.date.getTime());

          // Process each record with knowledge of the previous one
          for (let i = 0; i < vehicleGroup.length; i++) {
            const previousRecord = i > 0 ? vehicleGroup[i - 1] : undefined;
            enhancedRecords.push(FuelRecordMapper.enhanceFuelRecord(vehicleGroup[i], previousRecord));
          }
        });

        // Resort by date (newest first) for display
        enhancedRecords.sort((a, b) => b.date.getTime() - a.date.getTime());

        return enhancedRecords;
      })
    );
  }

  /**
   * Get a specific fuel record with calculated fields
   */
  getById(id: number): Observable<FuelRecord> {
    return this.externalApiService.getById(id).pipe(
      switchMap(record => {
        // Get previous records for the same vehicle to calculate efficiency
        return this.externalApiService.getByVehicleId(record.vehicleId).pipe(
          map(vehicleRecords => {
            // Sort by date descending
            vehicleRecords.sort((a, b) => b.date.getTime() - a.date.getTime());

            // Find the previous record (the one before this one chronologically)
            const index = vehicleRecords.findIndex(r => r.id === id);
            const previousRecord = index < vehicleRecords.length - 1 ? vehicleRecords[index + 1] : undefined;

            // Enhance the record with calculated fields
            return FuelRecordMapper.enhanceFuelRecord(record, previousRecord);
          })
        );
      })
    );
  }

  /**
   * Create a new fuel record
   */
  create(record: FuelRecord): Observable<FuelRecord> {
    return this.externalApiService.create(record);
  }

  /**
   * Update an existing fuel record
   */
  update(record: FuelRecord): Observable<FuelRecord> {
    return this.externalApiService.update(record);
  }

  /**
   * Delete a fuel record
   */
  delete(id: number): Observable<void> {
    return this.externalApiService.delete(id);
  }

  /**
   * Get vehicle records with history and statistics
   */
  getVehicleRecordsWithStats(vehicleId: number): Observable<{
    records: FuelRecord[],
    averageEfficiency: number,
    totalCost: number,
    totalQuantity: number
  }> {
    return this.externalApiService.getByVehicleId(vehicleId).pipe(
      map(records => {
        // Sort by date (oldest first) for calculation
        records.sort((a, b) => a.date.getTime() - b.date.getTime());

        // Calculate efficiency for each record
        const enhancedRecords: FuelRecord[] = [];
        let totalEfficiency = 0;
        let validEfficiencyCount = 0;

        for (let i = 0; i < records.length; i++) {
          const previousRecord = i > 0 ? records[i - 1] : undefined;
          const enhancedRecord = FuelRecordMapper.enhanceFuelRecord(records[i], previousRecord);

          if (enhancedRecord.efficiency) {
            totalEfficiency += enhancedRecord.efficiency;
            validEfficiencyCount++;
          }

          enhancedRecords.push(enhancedRecord);
        }

        // Calculate statistics
        const totalCost = enhancedRecords.reduce((sum, record) => sum + record.totalCost, 0);
        const totalQuantity = enhancedRecords.reduce((sum, record) => sum + record.quantity, 0);
        const averageEfficiency = validEfficiencyCount > 0 ? totalEfficiency / validEfficiencyCount : 0;

        // Sort by date (newest first) for display
        enhancedRecords.sort((a, b) => b.date.getTime() - a.date.getTime());

        return {
          records: enhancedRecords,
          averageEfficiency: parseFloat(averageEfficiency.toFixed(2)),
          totalCost: parseFloat(totalCost.toFixed(2)),
          totalQuantity: parseFloat(totalQuantity.toFixed(2))
        };
      })
    );
  }
}
