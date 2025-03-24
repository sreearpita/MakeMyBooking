import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-reminder-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './login-reminder-dialog.component.html',
  styleUrls: ['./login-reminder-dialog.component.css']
})
export class LoginReminderDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<LoginReminderDialogComponent>,
    private router: Router
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onLogin(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/login']);
  }
} 