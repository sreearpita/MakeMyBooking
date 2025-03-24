import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Booking } from '../interfaces/booking.interface';

export interface BookingStats {
  totalBookings: number;
  totalRevenue: number;
  totalTickets: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/admin/all`);
  }

  getBookingStats(): Observable<BookingStats> {
    return this.http.get<BookingStats>(`${this.apiUrl}/admin/stats`);
  }

  getBookingsByEvent(eventId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/event/${eventId}`);
  }
} 