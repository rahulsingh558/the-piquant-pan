import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  /* ================= PUBLIC PAGES ================= */
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu/menu').then(m => m.Menu),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart').then(m => m.CartPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact').then(m => m.Contact),
  },

  /* ================= USER PROTECTED ================= */
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/checkout/checkout').then(m => m.Checkout),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/orders/orders').then(m => m.OrdersPage),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./pages/wishlist/wishlist').then(m => m.Wishlist),
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/account/account').then(m => m.Account),
  },

  /* ================= ADMIN ================= */
  // 🔓 ADMIN LOGIN (NO GUARD)
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin/admin-login').then(m => m.AdminLogin),
  },

  // 🔐 ADMIN AREA (WITH LAYOUT) - IMPORTANT: Admin routes come BEFORE wildcard
  {
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-dashboard').then(m => m.AdminDashboard),
  },
  {
    path: 'admin/orders',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-orders').then(m => m.AdminOrdersComponent),
  },

  /* ================= FALLBACK ================= */
  {
    path: '**',
    redirectTo: '',
  },
];