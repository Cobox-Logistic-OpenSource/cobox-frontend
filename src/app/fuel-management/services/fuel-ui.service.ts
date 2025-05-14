// fuel-ui.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class FuelUiService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  /**
   * Show success notification
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Show error notification
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Show confirmation dialog
   */
  showConfirmDialog(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title, message }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Format currency values
   */
  formatCurrency(value: number): string {
    return `S/ ${value.toFixed(2)}`;
  }

  /**
   * Format volume values
   */
  formatVolume(value: number): string {
    return `${value.toFixed(2)} gal`;
  }

  /**
   * Format efficiency values
   */
  formatEfficiency(value?: number): string {
    if (value === undefined || value === null) {
      return 'N/A';
    }
    return `${value.toFixed(2)} km/l`;
  }

  /**
   * Format date values
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}
