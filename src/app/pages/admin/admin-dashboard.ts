import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MenuAdminService,
  AdminMenuItem,
} from '../../services/menu-admin.service';

import { AdminAuthService } from '../../services/admin-auth.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  /* =========================
     SIDEBAR STATE
  ========================== */
  isSidebarOpen = false;

  /* =========================
     MENU ITEMS
  ========================== */
  items: AdminMenuItem[] = [];
  showMenuForm = false;
  
  newItem: Omit<AdminMenuItem, 'id'> = {
    name: '',
    subtitle: 'Delicious • Fresh • Flavorful',
    basePrice: 0,
    type: 'veg', // Default type
    category: 'snacks', // Added category field
    image: '',
    defaultAddons: [],
    extraAddons: [],
  };

  /* =========================
     DASHBOARD METRICS
  ========================== */
  totalOrders = 124;
  totalCustomers = 68;
  notifications = 3;

  revenueThisWeek = 11980;
  revenueLastWeek = 9800;

  get totalRevenue(): number {
    return this.revenueThisWeek;
  }

  get revenueChangePercent(): number {
    if (this.revenueLastWeek === 0) return 0;
    return Math.round(
      ((this.revenueThisWeek - this.revenueLastWeek) /
        this.revenueLastWeek) *
        100
    );
  }

  /* ✅ ALIAS USED BY TEMPLATE */
  get revenueGrowthPercent(): number {
    return this.revenueChangePercent;
  }

  /* =========================
     ORDERS BAR CHART
  ========================== */
  ordersChart: { day: string; value: number }[] = [
    { day: 'Mon', value: 12 },
    { day: 'Tue', value: 18 },
    { day: 'Wed', value: 9 },
    { day: 'Thu', value: 15 },
    { day: 'Fri', value: 21 },
  ];

  maxOrders = Math.max(...this.ordersChart.map(o => o.value));

  get ordersLast5Days(): number {
    return this.ordersChart.reduce((sum, o) => sum + o.value, 0);
  }

  /* =========================
     REVENUE LINE CHART
  ========================== */
  revenueChart: { day: string; value: number }[] = [
    { day: 'Mon', value: 8200 },
    { day: 'Tue', value: 9100 },
    { day: 'Wed', value: 7600 },
    { day: 'Thu', value: 10400 },
    { day: 'Fri', value: 11980 },
  ];

  maxRevenue = Math.max(...this.revenueChart.map(r => r.value));
  revenuePolylinePoints = '';

  /* =========================
     TABLE DATA
  ========================== */
  recentOrders = [
    { id: '#ORD-101', customer: 'Rahul', amount: 280, status: 'Paid' },
    { id: '#ORD-102', customer: 'Amit', amount: 160, status: 'Paid' },
    { id: '#ORD-103', customer: 'Neha', amount: 340, status: 'Pending' },
    { id: '#ORD-104', customer: 'Sneha', amount: 220, status: 'Paid' },
    { id: '#ORD-105', customer: 'Vikas', amount: 180, status: 'Cancelled' },
  ];

  bestSelling = [
    { name: 'Veg Pakoda', sold: 52 },
    { name: 'Paneer Tikka', sold: 41 },
    { name: 'Chicken 65', sold: 34 },
    { name: 'Chicken Biryani', sold: 28 },
  ];

  constructor(
    private menuService: MenuAdminService,
    private auth: AdminAuthService
  ) {
    /* COMPREHENSIVE SEED DATA - All items from PDF */
    this.menuService.seedIfEmpty(this.menuService.getAllMenuItemsFromPDF());
    
    this.loadItems();
    this.buildRevenuePolyline();
    
    // On desktop, sidebar is open by default
    this.isSidebarOpen = window.innerWidth >= 1024;
  }

  /* =========================
     SIDEBAR METHODS
  ========================== */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /* =========================
     CATEGORY DISPLAY NAME
  ========================== */
  getCategoryDisplayName(categoryId: string): string {
    const categoryMap: { [key: string]: string } = {
      'snacks': 'Snacks',
      'starters': 'Starters',
      'sandwiches': 'Sandwiches',
      'noodles': 'Noodles & Maggi',
      'pizzas': 'Pizzas',
      'pasta': 'Pasta',
      'burgers': 'Burgers',
      'gravy': 'Gravy Items',
      'roti': 'Roti & Rice',
      'thali': 'Thali',
      'beverages': 'Beverages',
      'sweets': 'Sweets & Bakery',
      'healthy': 'Healthy Food',
      'bakery': 'Bakery'
    };
    
    return categoryMap[categoryId] || categoryId;
  }

  /* =========================
     HELPERS
  ========================== */
  buildRevenuePolyline() {
    this.revenuePolylinePoints = this.revenueChart
      .map(
        (p, i) =>
          `${i * 80 + 40},${160 - (p.value / this.maxRevenue) * 120}`
      )
      .join(' ');
  }

  /* =========================
     CRUD
  ========================== */
  loadItems() {
    this.items = this.menuService.getAll();
  }

  addItem() {
    if (!this.newItem.name || this.newItem.basePrice <= 0) return;

    this.menuService.add(this.newItem);
    this.loadItems();

    // Reset form
    this.newItem = {
      name: '',
      subtitle: 'Delicious • Fresh • Flavorful',
      basePrice: 0,
      type: 'veg',
      category: 'snacks', // Reset to default category
      image: '',
      defaultAddons: [],
      extraAddons: [],
    };
    
    this.showMenuForm = false;
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.menuService.delete(id);
      this.loadItems();
    }
  }

  logout() {
    this.auth.logout();
  }
}