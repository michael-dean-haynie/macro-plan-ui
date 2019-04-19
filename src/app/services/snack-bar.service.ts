import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) { }

  public showError(message?: string): void {
    message = message || 'Uh oh. Something went wrong...';
    this.snackBar.open(message, 'x', { duration: 5000, panelClass: 'error-snack-bar' });
  }

  public showSuccess(message?: string): void {
    message = message || 'Success!';
    this.snackBar.open(message, 'x', { duration: 3000, panelClass: 'success-snack-bar' });
  }
}
