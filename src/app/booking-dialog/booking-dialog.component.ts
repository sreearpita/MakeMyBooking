import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Event } from '../services/event.service';

export interface BookingData {
  name: string;
  email: string;
  numberOfTickets: number;
}

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.css']
})
export class BookingDialogComponent {
  bookingData: BookingData = {
    name: '',
    email: '',
    numberOfTickets: 1
  };

  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  emailError = '';

  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public event: Event
  ) {}

  validateEmail(): boolean {
    if (!this.bookingData.email) {
      this.emailError = 'Email is required';
      return false;
    }
    if (!this.emailPattern.test(this.bookingData.email)) {
      this.emailError = 'Please enter a valid email address';
      return false;
    }
    this.emailError = '';
    return true;
  }

  getTotalPrice(): string {
    return (this.event.price * this.bookingData.numberOfTickets).toFixed(2);
  }

  isValid(): boolean {
    return (
      this.bookingData.name.trim() !== '' &&
      this.validateEmail() &&
      this.bookingData.numberOfTickets > 0
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.isValid()) {
      this.dialogRef.close(this.bookingData);
    }
  }
} 