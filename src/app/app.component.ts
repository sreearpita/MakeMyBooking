import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private isBrowser: boolean;

  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Only check localStorage in browser environment
    if (this.isBrowser) {
      // Check if user is already logged in from localStorage
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      
      if (token && userJson) {
        try {
          // User is already logged in, no need to do anything
          console.log('User already logged in');
        } catch (e) {
          console.error('Error parsing user from localStorage', e);
          this.authService.logout();
        }
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
