import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventService, Event } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { BookingDialogComponent, BookingData } from '../booking-dialog/booking-dialog.component';
import { BookingConfirmationDialog } from '../booking-confirmation/booking-confirmation.component';
import { TicketsService } from '../services/tickets.service';
import { Booking } from '../interfaces/booking.interface';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginReminderDialogComponent } from '../dialogs/login-reminder-dialog/login-reminder-dialog.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private dialog: MatDialog,
    private authService: AuthService,
    private ticketsService: TicketsService
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const eventId = params['id'];
        if (history.state.event) {
          return of(history.state.event);
        }
        return this.eventService.getEventById(eventId);
      }),
      catchError(error => {
        this.error = 'Failed to load event details';
        return of(undefined);
      })
    ).subscribe(event => {
      this.event = event;
      this.loading = false;
    });
  }

  openBookingDialog(): void {
    if (!this.authService.isLoggedIn()) {
      this.dialog.open(LoginReminderDialogComponent, {
        width: '400px',
        disableClose: true
      });
      return;
    }

    if (!this.event) return;

    const dialogRef = this.dialog.open(BookingDialogComponent, {
      data: this.event,
      width: '500px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe((result: BookingData) => {
      if (result) {
        this.authService.user$.pipe(take(1)).subscribe(user => {
          if (user) {
            this.ticketsService.createBooking({
              event: this.event!,
              userId: user._id,
              name: result.name,
              email: result.email,
              numberOfTickets: result.numberOfTickets,
              totalAmount: this.event!.price * result.numberOfTickets
            }).subscribe({
              next: (booking: Booking) => {
                this.dialog.open(BookingConfirmationDialog, {
                  width: '400px',
                  panelClass: 'custom-dialog',
                  data: {
                    name: booking.name,
                    email: booking.email,
                    tickets: booking.numberOfTickets,
                    event: this.event
                  }
                });
              },
              error: (error: any) => {
                console.error('Booking failed:', error);
                // You might want to show an error dialog here
              }
            });
          }
        });
      }
    });
  }
} 