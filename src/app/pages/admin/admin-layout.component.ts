import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <app-admin-sidebar
        [isSidebarOpen]="isSidebarOpen"
        (toggleSidebar)="toggleSidebar()"
        (logout)="logout()">
      </app-admin-sidebar>

      <!-- Backdrop for mobile sidebar -->
      @if (isSidebarOpen) {
        <div 
          (click)="toggleSidebar()"
          class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"></div>
      }

      <!-- Main Content -->
      <div class="lg:ml-64">
        <!-- Top Header -->
        <header class="bg-white shadow-sm border-b">
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
              <!-- Mobile menu button - Hamburger -->
              <div class="lg:hidden">
                <button (click)="toggleSidebar()" class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
              </div>

              <!-- Page Title -->
              <div class="flex-1">
                <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h1>
                @if (pageDescription) {
                  <p class="text-sm text-gray-600">{{ pageDescription }}</p>
                }
              </div>

              <!-- Header Actions Slot -->
              <div class="flex items-center space-x-4">
                <ng-content select="[headerActions]"></ng-content>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="p-4 sm:p-6 lg:p-8">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class AdminLayoutComponent {
  @Input() pageTitle = 'Admin Dashboard';
  @Input() pageDescription = '';
  
  isSidebarOpen = false;

  ngOnInit() {
    // On desktop, sidebar is open by default
    this.isSidebarOpen = window.innerWidth >= 1024;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    // This should be implemented in the parent component
    console.log('Logout requested');
    // You can emit an event or call a service here
  }
}