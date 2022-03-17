import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  constructor(private snackbar: MatSnackBar) { }

  showSnack(message: string){
    this.snackbar.open(message, "Close", {
      duration: 3000,
    });
  }
}
