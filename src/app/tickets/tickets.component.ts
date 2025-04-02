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
import { DebugInfoComponent } from '../debug-info/debug-info.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DebugInfoComponent
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
    console.log('Fetching bookings for user ID:', userId);
    
    // First try with the new field name 'user'
    this.ticketsService.getUserBookings(userId).subscribe({
      next: (bookings) => {
        console.log('User bookings (user field):', bookings);
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings with user field:', error);
        
        // If that fails, try the debug endpoint which checks both fields
        this.ticketsService.debugUserBookings(userId).subscribe({
          next: (debugInfo) => {
            console.log('Debug info:', debugInfo);
            if (debugInfo.matchingBookings && debugInfo.matchingBookings.length > 0) {
              this.bookings = debugInfo.matchingBookings;
              this.loading = false;
            } else {
              // If still no bookings, show a clear message
              this.error = 'No tickets found for your account.';
              this.loading = false;
            }
          },
          error: (debugError) => {
            console.error('Debug endpoint error:', debugError);
            this.error = 'Failed to load your tickets. Please try again later.';
            this.loading = false;
          }
        });
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

  createTestBooking(): void {
    this.loading = true;
    this.error = null;
    
    this.ticketsService.createTestBooking().subscribe({
      next: (booking) => {
        console.log('Test booking created:', booking);
        this.bookings = [booking];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating test booking:', error);
        this.error = 'Failed to create test booking. Please try again later.';
        this.loading = false;
      }
    });
  }
} 