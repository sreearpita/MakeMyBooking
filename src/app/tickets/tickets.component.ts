import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketsService } from '../services/tickets.service';
import { AuthService } from '../services/auth.service';
import { Booking } from '../interfaces/booking.interface';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit, OnDestroy {
  bookings: Booking[] = [];
  loading = true;
  error: string | null = null;
  private userSubscription?: Subscription;

  constructor(
    private ticketsService: TicketsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserBookings();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadUserBookings(): void {
    this.loading = true;
    
    // Get the current user directly first
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser._id) {
      this.fetchBookings(currentUser._id);
    } else {
      // If not available directly, try from the observable
      this.userSubscription = this.authService.user$.pipe(take(1)).subscribe(user => {
        if (user && user._id) {
          this.fetchBookings(user._id);
        } else {
          this.loading = false;
          this.error = 'Please log in to view your tickets.';
        }
      });
    }
  }

  private fetchBookings(userId: string): void {
    this.ticketsService.getUserBookings(userId).subscribe({
      next: (bookings) => {
        console.log('User bookings:', bookings);
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.error = 'Failed to load your tickets. Please try again later.';
        this.loading = false;
      }
    });
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.ticketsService.cancelBooking(bookingId).subscribe({
        next: (cancelledBooking) => {
          this.snackBar.open('Booking cancelled successfully', 'Close', { duration: 3000 });
          // Update the booking in the list
          this.bookings = this.bookings.map(booking => 
            booking._id === bookingId ? cancelledBooking : booking
          );
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          this.snackBar.open('Failed to cancel booking', 'Close', { duration: 3000 });
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 