import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  showPass: boolean = false;
  username = '';
  password = '';
  error = '';

  constructor(
    private adminAuth: AdminAuthService,
    private router: Router
  ) {}

  login() {
    // Clear previous error
    this.error = '';

    // Validate inputs
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }

    // Attempt login
    const isAuthenticated = this.adminAuth.login(this.username, this.password);
    
    if (isAuthenticated) {
      console.log('Admin login successful');
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.error = 'Invalid admin credentials';
      console.log('Admin login failed');
    }
  }

  // Optional: Handle Enter key press
  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}