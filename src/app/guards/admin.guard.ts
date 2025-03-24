import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        const isAdmin = user?.role === 'admin';
        if (!isAdmin) {
          this.router.navigate(['/']);
        }
        return isAdmin;
      })
    );
  }
} 