import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Booking } from '../interfaces/booking.interface';
import { tap } from 'rxjs/operators';

export interface BookingStats {
  totalBookings: number;
  totalRevenue: number;
  totalTickets: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<Booking[]> {
    console.log('Fetching all bookings from:', `${this.apiUrl}/admin/all`);
    return this.http.get<Booking[]>(`${this.apiUrl}/admin/all`).pipe(
      tap(bookings => console.log('Received bookings:', bookings))
    );
  }

  getBookingStats(): Observable<BookingStats> {
    console.log('Fetching booking stats from:', `${this.apiUrl}/admin/stats`);
    return this.http.get<BookingStats>(`${this.apiUrl}/admin/stats`).pipe(
      tap(stats => console.log('Received stats:', stats))
    );
  }

  getBookingsByEvent(eventId: string): Observable<Booking[]> {
    console.log('Fetching bookings for event:', eventId);
    return this.http.get<Booking[]>(`${this.apiUrl}/event/${eventId}`).pipe(
      tap(bookings => console.log('Received event bookings:', bookings))
    );
  }

  fixAllBookings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/fix-bookings`);
  }
} 