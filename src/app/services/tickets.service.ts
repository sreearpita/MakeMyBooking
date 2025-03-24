import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Booking } from '../interfaces/booking.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getUserBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`);
  }

  cancelBooking(bookingId: string): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/cancel/${bookingId}`, {});
  }

  createBooking(bookingData: any): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, bookingData);
  }
} 