import { Event } from '../services/event.service';

export interface Booking {
  _id: string;
  event: Event;
  user?: string | object;
  userId?: string | object;
  name: string;
  email: string;
  numberOfTickets: number;
  totalAmount: number;
  bookingDate: string;
  status: string;
} 