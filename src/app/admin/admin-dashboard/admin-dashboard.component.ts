import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminService, BookingStats } from '../../services/admin.service';
import { Booking } from '../../interfaces/booking.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  stats: BookingStats | null = null;
  loading = true;
  error: string | null = null;

  // Table configuration
  displayedColumns: string[] = ['name', 'email', 'event', 'tickets', 'amount', 'date', 'status'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  pageIndex = 0;
  totalBookings = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadBookings();
    this.loadStats();
  }

  loadBookings(): void {
    this.loading = true;
    this.adminService.getAllBookings().subscribe({
      next: (bookings) => {
        console.log('All bookings:', bookings);
        
        // Check which bookings have missing event data
        const missingEventBookings = bookings.filter(booking => !booking.event);
        if (missingEventBookings.length > 0) {
          console.warn('Bookings with missing event data:', missingEventBookings);
        }
        
        this.bookings = bookings.filter(booking => booking.event);
        this.totalBookings = this.bookings.length;
        this.updateFilteredBookings();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load bookings. Please try again later.';
        this.loading = false;
        console.error('Error loading bookings:', error);
      }
    });
  }

  loadStats(): void {
    this.adminService.getBookingStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  updateFilteredBookings(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.filteredBookings = this.bookings.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateFilteredBookings();
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.bookings = this.bookings.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'email': return this.compare(a.email, b.email, isAsc);
        case 'event': return this.compare(a.event.title, b.event.title, isAsc);
        case 'tickets': return this.compare(a.numberOfTickets, b.numberOfTickets, isAsc);
        case 'amount': return this.compare(a.totalAmount, b.totalAmount, isAsc);
        case 'date': return this.compare(new Date(a.bookingDate), new Date(b.bookingDate), isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
    this.updateFilteredBookings();
  }

  private compare(a: any, b: any, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
} 