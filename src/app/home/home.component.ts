import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { EventService, Event } from '../services/event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedCategory: string = 'all';
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  searchLocation: string = '';
  loading = true;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventService.getAllEvents().subscribe(events => {
      this.filteredEvents = events;
      this.loading = false;
    });
  }

  filterEvents(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearchInput() {
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredEvents = this.eventService.filterEvents(
      this.selectedCategory,
      this.searchTerm,
      this.searchLocation
    );
  }

  navigateToDetails(event: Event) {
    this.router.navigate(['/event', event._id], {
      state: { event: event }
    });
  }
} 