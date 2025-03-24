import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Event {
  _id: string;  // MongoDB id
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  interested: string;
  image: string;
  category: string;
  description?: string;
  imdbRating?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadEvents();
  }

  private loadEvents() {
    this.http.get<Event[]>(this.apiUrl)
      .subscribe(events => {
        this.eventsSubject.next(events);
      });
  }

  getAllEvents(): Observable<Event[]> {
    return this.events$;
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  filterEvents(category: string, searchTerm: string, location: string): Event[] {
    const events = this.eventsSubject.value;
    return events.filter(event => {
      const matchesCategory = category === 'all' || event.category === category;
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = event.location.toLowerCase().includes(location.toLowerCase());
      return matchesCategory && matchesSearch && matchesLocation;
    });
  }

  addEvent(event: Omit<Event, '_id'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 