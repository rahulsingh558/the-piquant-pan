import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { CartService } from '../../services/cart';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink, ClickOutsideDirective],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  showProfileMenu = false;
  mobileMenuOpen = false;
  cartCount = 0;
  isBrowser = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.cartService.cartCount$.subscribe((count: number) => {
        this.cartCount = count;
      });
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu() {
    this.showProfileMenu = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  logout() {
    if (!this.isBrowser) return;
    localStorage.removeItem('isLoggedIn');
    this.closeProfileMenu();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}