import { Event } from '../services/event.service';

export interface Booking {
  _id: string;
  event: Event;
  name: string;
  email: string;
  numberOfTickets: number;
  totalAmount: number;
  bookingDate: string;
  status: 'active' | 'cancelled';
} 