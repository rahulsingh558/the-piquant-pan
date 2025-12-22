import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cart-item';

@Component({
  standalone: true,
  templateUrl: './checkout.html',
  imports: [
    CommonModule, // ✅ ngIf, ngFor
    FormsModule,  // ✅ ngModel
  ],
})
export class Checkout implements OnInit {
  name = '';
  phone = '';
  address = '';

  items: CartItem[] = [];
  isPlacingOrder = false;
  isBrowser = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.items = items;
    });
  }

  isFormValid(): boolean {
    return (
      this.name.trim().length > 0 &&
      this.phone.trim().length >= 10 &&
      this.address.trim().length > 0 &&
      this.items.length > 0
    );
  }

  getGrandTotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.totalPrice * item.quantity,
      0
    );
  }

  placeOrder() {
    if (!this.isBrowser || !this.isFormValid()) return;

    this.isPlacingOrder = true;

    const order = {
      id: 'ORD-' + Date.now(),
      date: new Date().toISOString(),
      customer: {
        name: this.name,
        phone: this.phone,
        address: this.address,
      },
      items: this.items,
      total: this.getGrandTotal(),
    };

    const existingOrders =
      JSON.parse(localStorage.getItem('orders') || '[]');

    localStorage.setItem(
      'orders',
      JSON.stringify([order, ...existingOrders])
    );

    setTimeout(() => {
      this.isPlacingOrder = false;
      this.cartService.clearCart();
      alert('Order placed successfully!');
      this.router.navigate(['/orders']);
    }, 800);
  }
}