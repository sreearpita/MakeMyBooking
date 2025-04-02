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
    console.log(`Requesting bookings from ${this.apiUrl}/user/${userId}`);
    return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`);
  }

  debugUserBookings(userId: string): Observable<any> {
    console.log(`Requesting debug info from ${this.apiUrl}/debug/${userId}`);
    return this.http.get<any>(`${this.apiUrl}/debug/${userId}`);
  }

  cancelBooking(bookingId: string): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/cancel/${bookingId}`, {});
  }

  createBooking(bookingData: any): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, bookingData);
  }

  createTestBooking(): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/test-booking`, {});
  }
} 