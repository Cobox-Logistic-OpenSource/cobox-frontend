import { FuelRecord } from '../models/fuel-record.model';
import { FuelType } from '../models/fuel-type.enum';

export class FuelRecordMapper {

  /**
   * Maps API response to FuelRecord model
   */
  static toFuelRecord(data: any): FuelRecord {
    return {
      id: data.id,
      vehicleId: data.vehicleId,
      vehiclePlate: data.vehiclePlate,
      date: new Date(data.date),
      fuelType: data.fuelType as FuelType,
      quantity: data.quantity,
      totalCost: data.totalCost,
      currentMileage: data.currentMileage,
      station: data.station,
      location: data.location,
      invoiceNumber: data.invoiceNumber,
      notes: data.notes,
      efficiency: data.efficiency,
      previousMileage: data.previousMileage,
      distance: data.distance
    };
  }

  /**
   * Maps FuelRecord model to API request format
   */
  static toApiRequest(record: FuelRecord): any {
    return {
      id: record.id,
      vehicleId: record.vehicleId,
      vehiclePlate: record.vehiclePlate,
      date: record.date.toISOString(),
      fuelType: record.fuelType,
      quantity: record.quantity,
      totalCost: record.totalCost,
      currentMileage: record.currentMileage,
      station: record.station,
      location: record.location,
      invoiceNumber: record.invoiceNumber,
      notes: record.notes
    };
  }

  /**
   * Calculates fuel efficiency if possible
   */
  static calculateEfficiency(record: FuelRecord, previousRecord?: FuelRecord): number | undefined {
    if (!previousRecord || !record.currentMileage || !previousRecord.currentMileage) {
      return undefined;
    }

    const distance = record.currentMileage - previousRecord.currentMileage;
    if (distance <= 0 || !record.quantity) {
      return undefined;
    }

    // Calculate kilometers per liter
    return parseFloat((distance / record.quantity).toFixed(2));
  }

  /**
   * Enhances a fuel record with calculated fields
   */
  static enhanceFuelRecord(record: FuelRecord, previousRecord?: FuelRecord): FuelRecord {
    if (!previousRecord) {
      return record;
    }

    const distance = record.currentMileage - previousRecord.currentMileage;

    return {
      ...record,
      previousMileage: previousRecord.currentMileage,
      distance: distance > 0 ? distance : undefined,
      efficiency: this.calculateEfficiency(record, previousRecord)
    };
  }
}
