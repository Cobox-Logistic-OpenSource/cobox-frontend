import { Injectable } from '@angular/core';
import { MileagePurpose } from '../models/mileage-purpose.enum';

@Injectable({
  providedIn: 'root'
})
export class MileageUIService {

  getPurposeClass(purpose: MileagePurpose): string {
    switch (purpose) {
      case MileagePurpose.DELIVERY:
        return 'purpose-delivery';
      case MileagePurpose.PICKUP:
        return 'purpose-pickup';
      case MileagePurpose.MAINTENANCE:
        return 'purpose-maintenance';
      case MileagePurpose.TRANSFER:
        return 'purpose-transfer';
      case MileagePurpose.OTHER:
        return 'purpose-other';
      default:
        return '';
    }
  }

  getPurposeLabel(purpose: MileagePurpose): string {
    switch (purpose) {
      case MileagePurpose.DELIVERY:
        return 'Entrega';
      case MileagePurpose.PICKUP:
        return 'Recojo';
      case MileagePurpose.MAINTENANCE:
        return 'Mantenimiento';
      case MileagePurpose.TRANSFER:
        return 'Transferencia';
      case MileagePurpose.OTHER:
        return 'Otro';
      default:
        return String(purpose);
    }
  }

  formatDistance(distance: number): string {
    return `${distance.toFixed(1)} km`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}
