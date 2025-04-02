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
import { HttpClient } from '@angular/common/http';

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

  constructor(private adminService: AdminService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    
    // Get booking statistics
    this.adminService.getBookingStats().subscribe({
      next: (stats) => {
        console.log('Admin stats:', stats);
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
    
    // Get all bookings
    this.adminService.getAllBookings().subscribe({
      next: (bookings) => {
        console.log('Admin bookings:', bookings);
        this.bookings = bookings;
        this.totalBookings = bookings.length;
        this.updateFilteredBookings();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.error = 'Failed to load bookings';
        this.loading = false;
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

  fixAllBookings(): void {
    this.adminService.fixAllBookings().subscribe({
      next: (result) => {
        console.log('Fix result:', result);
        alert(`Fix completed: ${result.updatedBookings} bookings updated out of ${result.totalBookings}`);
        // Reload bookings after fix
        this.loadBookings();
      },
      error: (error) => {
        console.error('Error fixing bookings:', error);
        alert('Failed to fix bookings. See console for details.');
      }
    });
  }

  manualFixBookings(): void {
    // Get all bookings
    this.adminService.getAllBookings().subscribe(bookings => {
      console.log(`Found ${bookings.length} bookings`);
      
      // Filter bookings that need fixing
      const bookingsToFix = bookings.filter(booking => 
        booking.userId && !booking.user
      );
      
      console.log(`Found ${bookingsToFix.length} bookings to fix`);
      
      // Fix each booking
      let fixedCount = 0;
      bookingsToFix.forEach(booking => {
        // Create a new booking object with user field
        const fixedBooking = {
          ...booking,
          user: booking.userId
        };
        
        // Update the booking
        this.http.put(`${this.adminService.apiUrl}/${booking._id}`, fixedBooking)
          .subscribe({
            next: () => {
              console.log(`Fixed booking ${booking._id}`);
              fixedCount++;
              if (fixedCount === bookingsToFix.length) {
                console.log(`Fixed ${fixedCount} bookings`);
                alert(`Fixed ${fixedCount} bookings`);
                this.loadBookings();
              }
            },
            error: (error) => {
              console.error(`Error fixing booking ${booking._id}:`, error);
            }
          });
      });
      
      if (bookingsToFix.length === 0) {
        alert('No bookings need fixing');
      }
    });
  }

  checkBookingFields(): void {
    this.adminService.getAllBookings().subscribe(bookings => {
      console.log(`Found ${bookings.length} total bookings`);
      
      // Check for bookings with userId but no user
      const bookingsWithUserId = bookings.filter(b => b.userId);
      const bookingsWithUser = bookings.filter(b => b.user);
      const bookingsWithBoth = bookings.filter(b => b.userId && b.user);
      const bookingsWithNeither = bookings.filter(b => !b.userId && !b.user);
      
      console.log(`Bookings with userId: ${bookingsWithUserId.length}`);
      console.log(`Bookings with user: ${bookingsWithUser.length}`);
      console.log(`Bookings with both fields: ${bookingsWithBoth.length}`);
      console.log(`Bookings with neither field: ${bookingsWithNeither.length}`);
      
      // Check if any bookings still need fixing
      const bookingsNeedingFix = bookings.filter(b => b.userId && !b.user);
      console.log(`Bookings still needing fix: ${bookingsNeedingFix.length}`);
      
      if (bookingsNeedingFix.length > 0) {
        console.log('Sample booking needing fix:', bookingsNeedingFix[0]);
      }
      
      alert(`
        Total bookings: ${bookings.length}
        With userId: ${bookingsWithUserId.length}
        With user: ${bookingsWithUser.length}
        With both: ${bookingsWithBoth.length}
        With neither: ${bookingsWithNeither.length}
        Still needing fix: ${bookingsNeedingFix.length}
      `);
    });
  }

  loadBookings(): void {
    this.loading = true;
    this.adminService.getAllBookings().subscribe({
      next: (bookings) => {
        console.log('Admin bookings:', bookings);
        this.bookings = bookings;
        this.totalBookings = bookings.length;
        this.updateFilteredBookings();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.error = 'Failed to load bookings';
        this.loading = false;
      }
    });
  }
} 