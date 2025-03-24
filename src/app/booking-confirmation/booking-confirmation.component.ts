import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Event } from '../services/event.service';

interface DialogData {
  name: string;
  email: string;
  tickets: number;
  event: Event;
}

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<BookingConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  getTotalPrice(): string {
    return (this.data.event.price * this.data.tickets).toFixed(2);
  }

  close(): void {
    this.dialogRef.close();
  }
} 