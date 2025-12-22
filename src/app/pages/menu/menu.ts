import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';
import { MenuAdminService, AdminMenuItem } from '../../services/menu-admin.service';
import { Food } from '../../models/food';
import { Addon } from '../../models/addon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

type FoodType = 'veg' | 'egg' | 'nonveg';

interface MenuFood extends Food {
  image: string;
  type: FoodType;
  freeAddonIds: number[];
  addons: Addon[];
}

@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './menu.html',
})
export class Menu {
  isBrowser = false;
  faCartPlus = faCartPlus;

  selectedType: 'all' | FoodType = 'all';

  foods: MenuFood[] = [];

  /* =========================
     MODAL STATE
  ========================== */
  showAddonModal = false;
  selectedFood!: MenuFood;
  modalSelectedFreeAddons: Addon[] = []; // For free addons (onion, tomato, cucumber, lemon, coriander)
  modalSelectedPremiumAddons: Addon[] = []; // For premium addons (paid)
  modalTotal = 0;

  /* =========================
     WISHLIST
  ========================== */
  wishlist: { id: number; name: string; basePrice: number }[] = [];

  /* =========================
     ADDON IMAGES MAPPING
  ========================== */
  addonImages: { [key: string]: string } = {
    'Onion': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop&crop=center',
    'Tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop&crop=center',
    'Cucumber': 'https://images.unsplash.com/photo-1582515081135-73c2c5298ac3?w=200&h=200&fit=crop&crop=center',
    'Lemon': 'https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w=200&h=200&fit=crop&crop=center',
    'Coriander': 'https://images.unsplash.com/photo-1579118468075-5a8b7a9b4f03?w=200&h=200&fit=crop&crop=center',
    'Sweet Corn': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&h=200&fit=crop&crop=center',
    'Broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&h=200&fit=crop&crop=center',
    'Beans': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop&crop=center',
    'Peas': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop&crop=center',
    'Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop&crop=center',
    'Capsicum': 'https://images.unsplash.com/photo-1596284244832-2de51e60d1c2?w=200&h=200&fit=crop&crop=center',
    'Cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=200&fit=crop&crop=center',
    'Mushroom': 'https://images.unsplash.com/photo-1485579148751-308a1fe6b0b5?w=200&h=200&fit=crop&crop=center',
    'Bell Pepper': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=200&h=200&fit=crop&crop=center'
  };

  constructor(
    private cartService: CartService,
    private adminMenu: MenuAdminService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.wishlist = JSON.parse(
        localStorage.getItem('wishlist') || '[]'
      );
      this.loadMenu();
    }
  }

  /* =========================
     LOAD MENU (ADMIN → USER)
  ========================== */
  loadMenu() {
    const adminItems = this.adminMenu.getAll();

    if (adminItems.length > 0) {
      this.foods = adminItems.map(item => this.mapAdminToFood(item));
    } else {
      this.foods = this.getFallbackMenu();
    }
  }

  /* =========================
     ADMIN → FOOD MAPPER
  ========================== */
  mapAdminToFood(item: AdminMenuItem): MenuFood {
    // Free addons (checked by default but can be removed)
    const freeAddons: Addon[] = [
      { id: 1, name: 'Onion', price: 0 },
      { id: 2, name: 'Tomato', price: 0 },
      { id: 3, name: 'Cucumber', price: 0 },
      { id: 4, name: 'Lemon', price: 0 },
      { id: 5, name: 'Coriander', price: 0 },
    ];

    // Premium addons based on food type
    let premiumAddons: Addon[] = [];
    
    if (item.type === 'veg' || item.type === 'egg') {
      premiumAddons = [
        { id: 6, name: 'Sweet Corn', price: 20 },
        { id: 7, name: 'Broccoli', price: 25 },
        { id: 8, name: 'Beans', price: 15 },
        { id: 9, name: 'Peas', price: 15 },
        { id: 10, name: 'Spinach', price: 20 },
        { id: 15, name: 'Bell Pepper', price: 15 },
      ];
    } else if (item.type === 'nonveg') {
      premiumAddons = [
        { id: 11, name: 'Capsicum', price: 20 },
        { id: 12, name: 'Broccoli', price: 25 },
        { id: 13, name: 'Cheese', price: 30 },
        { id: 14, name: 'Mushroom', price: 25 },
        { id: 16, name: 'Bell Pepper', price: 15 },
      ];
    }

    const allAddons = [...freeAddons, ...premiumAddons];

    return {
      id: item.id,
      name: item.name,
      subtitle: item.subtitle || 'Healthy • Fresh • Protein-rich',
      basePrice: item.basePrice,
      category: 'sprouts',
      type: item.type,
      image: item.image,
      addons: allAddons,
      freeAddonIds: freeAddons.map(a => a.id), // All free addons (checked by default)
    };
  }

  /* =========================
     FALLBACK MENU
  ========================== */
  getFallbackMenu(): MenuFood[] {
    // Free addons
    const freeAddons: Addon[] = [
      { id: 1, name: 'Onion', price: 0 },
      { id: 2, name: 'Tomato', price: 0 },
      { id: 3, name: 'Cucumber', price: 0 },
      { id: 4, name: 'Lemon', price: 0 },
      { id: 5, name: 'Coriander', price: 0 },
    ];

    // Veg & Egg premium addons
    const vegEggPremiumAddons: Addon[] = [
      { id: 6, name: 'Sweet Corn', price: 20 },
      { id: 7, name: 'Broccoli', price: 25 },
      { id: 8, name: 'Beans', price: 15 },
      { id: 9, name: 'Peas', price: 15 },
      { id: 10, name: 'Spinach', price: 20 },
      { id: 15, name: 'Bell Pepper', price: 15 },
    ];

    // Non-Veg premium addons
    const nonvegPremiumAddons: Addon[] = [
      { id: 11, name: 'Capsicum', price: 20 },
      { id: 12, name: 'Broccoli', price: 25 },
      { id: 13, name: 'Cheese', price: 30 },
      { id: 14, name: 'Mushroom', price: 25 },
      { id: 16, name: 'Bell Pepper', price: 15 },
    ];

    return [
      {
        id: 1,
        name: 'Moong Sprouts Bowl',
        subtitle: 'Healthy • Fresh • Protein-rich',
        basePrice: 80,
        category: 'sprouts',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 2,
        name: 'Egg Sprouts Bowl',
        subtitle: 'High Protein • Energizing',
        basePrice: 100,
        category: 'sprouts',
        type: 'egg',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 3,
        name: 'Chicken Sprouts Bowl',
        subtitle: 'High Protein • Muscle Building',
        basePrice: 120,
        category: 'sprouts',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },
    ];
  }

  /* =========================
     FILTER
  ========================== */
  get filteredFoods() {
    if (this.selectedType === 'all') return this.foods;
    return this.foods.filter(f => f.type === this.selectedType);
  }

  /* =========================
     ADDON CATEGORIZATION
  ========================== */

  getPremiumAddonsTotal(): number {
    return this.modalSelectedPremiumAddons.reduce((sum, addon) => sum + addon.price, 0);
  }
  getFreeAddons(food: MenuFood): Addon[] {
    return food.addons.filter(addon => addon.price === 0);
  }

  getPremiumAddons(food: MenuFood): Addon[] {
    return food.addons.filter(addon => addon.price > 0);
  }

  getAddonImage(addonName: string): string {
    return this.addonImages[addonName] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&crop=center';
  }

  isPremiumAddonSelected(id: number): boolean {
    return this.modalSelectedPremiumAddons.some(a => a.id === id);
  }

  isFreeAddonSelected(id: number): boolean {
    return this.modalSelectedFreeAddons.some(a => a.id === id);
  }

  /* =========================
     WISHLIST
  ========================== */
  toggleWishlist(food: Food) {
    const i = this.wishlist.findIndex(w => w.id === food.id);
    i > -1
      ? this.wishlist.splice(i, 1)
      : this.wishlist.push({
          id: food.id,
          name: food.name,
          basePrice: food.basePrice,
        });

    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  isWishlisted(id: number) {
    return this.wishlist.some(w => w.id === id);
  }

  /* =========================
     ADDON MODAL
  ========================== */
  openAddonPopup(food: MenuFood) {
    this.selectedFood = food;
    
    // Set all free addons as selected by default
    const freeAddons = this.getFreeAddons(food);
    this.modalSelectedFreeAddons = [...freeAddons];
    this.modalSelectedPremiumAddons = [];
    
    this.calculateTotal();
    this.showAddonModal = true;
  }

  closeAddonPopup() {
    this.showAddonModal = false;
    this.modalSelectedFreeAddons = [];
    this.modalSelectedPremiumAddons = [];
  }

  toggleFreeAddon(addon: Addon) {
    const i = this.modalSelectedFreeAddons.findIndex(a => a.id === addon.id);
    i > -1
      ? this.modalSelectedFreeAddons.splice(i, 1)
      : this.modalSelectedFreeAddons.push(addon);
    this.calculateTotal();
  }

  togglePremiumAddon(addon: Addon) {
    const i = this.modalSelectedPremiumAddons.findIndex(a => a.id === addon.id);
    i > -1
      ? this.modalSelectedPremiumAddons.splice(i, 1)
      : this.modalSelectedPremiumAddons.push(addon);
    this.calculateTotal();
  }

  calculateTotal() {
    // Base price
    let total = this.selectedFood.basePrice;
    
    // Add premium addons (paid)
    total += this.modalSelectedPremiumAddons.reduce((sum, addon) => sum + addon.price, 0);
    
    this.modalTotal = total;
  }

  confirmAddToCart() {
    // Combine all selected addons
    const allSelectedAddons = [
      ...this.modalSelectedFreeAddons,
      ...this.modalSelectedPremiumAddons,
    ];

    this.cartService.addToCart({
      foodId: this.selectedFood.id,
      name: this.selectedFood.name,
      basePrice: this.selectedFood.basePrice,
      addons: allSelectedAddons,
      quantity: 1,
      totalPrice: this.modalTotal,
    });
    this.closeAddonPopup();
  }
}