import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-debug-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showDebug" style="background: #f0f0f0; padding: 10px; margin: 10px; border-radius: 5px;">
      <h3>Debug Info</h3>
      <p>User ID: {{ userId }}</p>
      <p>User from localStorage: {{ userFromStorage | json }}</p>
      <p>Current User: {{ currentUser | json }}</p>
      <button (click)="testAuth()">Test Authentication</button>
      <button (click)="showDebug = false">Hide</button>
      <div *ngIf="authTestResult">
        <h4>Auth Test Result:</h4>
        <pre>{{ authTestResult | json }}</pre>
      </div>
    </div>
  `
})
export class DebugInfoComponent implements OnInit {
  userId: string = 'Not available';
  userFromStorage: any = null;
  currentUser: any = null;
  showDebug = true;
  authTestResult: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Get current user from service
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userId = this.currentUser._id;
    }

    // Get user from localStorage directly
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          this.userFromStorage = JSON.parse(userJson);
        } catch (e) {
          console.error('Error parsing user from localStorage', e);
        }
      }
    }
  }

  testAuth(): void {
    this.authService.testAuth().subscribe({
      next: (result) => {
        this.authTestResult = result;
      },
      error: (error) => {
        console.error('Auth test failed:', error);
        this.authTestResult = { error: error.message || 'Authentication failed' };
      }
    });
  }
} 