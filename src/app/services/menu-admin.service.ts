import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/* =========================
   ADDON MODEL
========================= */
export interface Addon {
  id: number;
  name: string;
  price: number;
}

/* =========================
   MENU ITEM MODEL (ADMIN = SOURCE OF TRUTH)
========================= */
export interface AdminMenuItem {
  id: number;
  name: string;
  subtitle: string;
  basePrice: number;
  type: 'veg' | 'egg' | 'nonveg';
  image: string;
  category: string; // Add this line
  defaultAddons: Addon[];
  extraAddons: Addon[];
}

@Injectable({
  providedIn: 'root',
})
export class MenuAdminService {
  private readonly STORAGE_KEY = 'admin_menu_items';
  private isBrowser = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /* =========================
     READ
  ========================== */
  getAll(): AdminMenuItem[] {
    if (!this.isBrowser) return [];
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getById(id: number): AdminMenuItem | undefined {
    return this.getAll().find(item => item.id === id);
  }

  /* =========================
     WRITE
  ========================== */
  private save(items: AdminMenuItem[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  /* =========================
     CREATE
  ========================== */
  add(item: Omit<AdminMenuItem, 'id'>): void {
    const items = this.getAll();

    const newItem: AdminMenuItem = {
      ...item,
      id: Date.now(),
    };

    items.push(newItem);
    this.save(items);
  }

  /* =========================
     UPDATE
  ========================== */
  update(updatedItem: AdminMenuItem): void {
    const items = this.getAll().map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.save(items);
  }

  /* =========================
     DELETE
  ========================== */
  delete(id: number): void {
    const items = this.getAll().filter(item => item.id !== id);
    this.save(items);
  }

  /* =========================
     SEED (ONE TIME SYNC)
     Used to copy menu.ts items into admin
  ========================== */
  seedIfEmpty(items: AdminMenuItem[]): void {
    if (!this.isBrowser) return;
    if (this.getAll().length > 0) return;
    this.save(items);
  }

  /* =========================
     UTIL
  ========================== */
  clearAll(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.STORAGE_KEY);
  }



  /* =========================
     ALL MENU ITEMS FROM PDF
  ========================== */
  getAllMenuItemsFromPDF(): AdminMenuItem[] {
    return [
      // SNACKS (Page 1)
      {
        id: 1, name: 'Veg Pakoda', subtitle: 'Crispy fried vegetable fritters', basePrice: 50, type: 'veg', category: 'snacks',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 2, name: 'Onion Pakoda', subtitle: 'Crispy onion fritters', basePrice: 50, type: 'veg', category: 'snacks',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 3, name: 'Mirchi Bhajji', subtitle: 'Spicy chili fritters', basePrice: 50, type: 'veg', category: 'snacks',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 4, name: 'Aloo Chap (2 pcs)', subtitle: 'Potato patties', basePrice: 50, type: 'veg', category: 'snacks',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 5, name: 'Potato Cheese Balls', subtitle: 'Cheesy potato balls', basePrice: 99, type: 'veg', category: 'snacks',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 6, name: 'French Fries', subtitle: 'Crispy potato fries', basePrice: 99, type: 'veg', category: 'snacks',
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 7, name: 'Crispy Corn', subtitle: 'Crispy fried corn', basePrice: 200, type: 'veg', category: 'snacks',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 8, name: 'Nachos with Cheese', subtitle: 'Crispy nachos with cheese dip', basePrice: 250, type: 'veg', category: 'snacks',
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 9, name: 'Cheese Stuffed Potato', subtitle: 'Cheese + Corn + Veggies + Paneer + Potato Cup (4 Pcs)', basePrice: 250, type: 'veg', category: 'snacks',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // STARTERS VEG (Page 2)
      {
        id: 10, name: 'Gobi Chilli', subtitle: 'Spicy cauliflower stir-fry', basePrice: 120, type: 'veg', category: 'starters',
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 11, name: 'Gobi Manchurian', subtitle: 'Indo-Chinese cauliflower', basePrice: 120, type: 'veg', category: 'starters',
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 12, name: 'Mushroom Pakoda', subtitle: 'Crispy mushroom fritters', basePrice: 160, type: 'veg', category: 'starters',
        image: 'https://images.unsplash.com/photo-1485579148751-308a1fe6b0b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 13, name: 'Paneer Tikka', subtitle: 'Grilled cottage cheese cubes', basePrice: 180, type: 'veg', category: 'starters',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // STARTERS NON-VEG (Page 3-4)
      {
        id: 14, name: 'Boiled Egg (2 Nos)', subtitle: 'Hard boiled eggs', basePrice: 40, type: 'egg', category: 'starters',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 15, name: 'Egg Bhurji', subtitle: 'Spicy scrambled eggs', basePrice: 80, type: 'egg', category: 'starters',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 16, name: 'Chicken 65', subtitle: 'Spicy deep-fried chicken', basePrice: 175, type: 'nonveg', category: 'starters',
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 17, name: 'Chicken Tikka', subtitle: 'Grilled chicken pieces', basePrice: 225, type: 'nonveg', category: 'starters',
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 18, name: 'Prawn Fry', subtitle: 'Crispy fried prawns', basePrice: 240, type: 'nonveg', category: 'starters',
        image: 'https://images.unsplash.com/photo-1580959375944-abd7e991f971?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // SANDWICHES (Page 5)
      {
        id: 19, name: 'Grilled Cheese', subtitle: 'Classic grilled cheese sandwich', basePrice: 110, type: 'veg', category: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 20, name: 'Grilled Paneer Cheese', subtitle: 'Paneer and cheese grilled sandwich', basePrice: 150, type: 'veg', category: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 21, name: 'Grilled Chicken Cheese', subtitle: 'Chicken and cheese grilled sandwich', basePrice: 160, type: 'nonveg', category: 'sandwiches',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // NOODLES & MAGGI (Page 6)
      {
        id: 22, name: 'Veg Noodles', subtitle: 'Vegetable stir-fry noodles', basePrice: 130, type: 'veg', category: 'noodles',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 23, name: 'Egg Noodles', subtitle: 'Noodles with egg', basePrice: 140, type: 'egg', category: 'noodles',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 24, name: 'Chicken Noodles', subtitle: 'Noodles with chicken', basePrice: 160, type: 'nonveg', category: 'noodles',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 25, name: 'Piquant Spl Maggi', subtitle: 'Veggies Paneer Mushroom Corn Cheese Maggi', basePrice: 120, type: 'veg', category: 'noodles',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // PIZZAS (Page 6-7)
      {
        id: 26, name: 'Cheese Pizza (7")', subtitle: 'Classic cheese pizza', basePrice: 150, type: 'veg', category: 'pizzas',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 27, name: 'Chicken Cheese Pizza (7")', subtitle: 'Chicken and cheese pizza', basePrice: 180, type: 'nonveg', category: 'pizzas',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // PASTA (Page 8)
      {
        id: 28, name: 'Cheese Pasta (White Sauce)', subtitle: 'Creamy white sauce pasta', basePrice: 160, type: 'veg', category: 'pasta',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 29, name: 'Chicken Cheese Pasta (Pink Sauce)', subtitle: 'Pink sauce pasta with chicken', basePrice: 210, type: 'nonveg', category: 'pasta',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // BURGERS
      {
        id: 30, name: 'Veg Burger', subtitle: 'Vegetable burger', basePrice: 120, type: 'veg', category: 'burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 31, name: 'Chicken Burger', subtitle: 'Chicken patty burger', basePrice: 145, type: 'nonveg', category: 'burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // GRAVY VEG (Page 9-10)
      {
        id: 32, name: 'Paneer Butter Masala', subtitle: 'Cottage cheese in rich gravy', basePrice: 170, type: 'veg', category: 'gravy',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 33, name: 'Dal Makhani', subtitle: 'Creamy black lentil curry', basePrice: 120, type: 'veg', category: 'gravy',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // GRAVY NON-VEG (Page 10-11)
      {
        id: 34, name: 'Chicken Butter Masala', subtitle: 'Chicken in rich buttery gravy', basePrice: 180, type: 'nonveg', category: 'gravy',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 35, name: 'Mutton Curry', subtitle: 'Spicy mutton curry', basePrice: 270, type: 'nonveg', category: 'gravy',
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // ROTI & RICE (Page 11-13)
      {
        id: 36, name: 'Paratha (Aloo) 2 pcs', subtitle: 'Potato stuffed flatbread', basePrice: 60, type: 'veg', category: 'roti',
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 37, name: 'Veg Fried Rice', subtitle: 'Fried rice with vegetables', basePrice: 150, type: 'veg', category: 'roti',
        image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 38, name: 'Chicken Biryani + Raita', subtitle: 'Fragrant rice with chicken', basePrice: 199, type: 'nonveg', category: 'roti',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // THALI (Page 13-15)
      {
        id: 39, name: 'Veg Deluxe Thali', subtitle: 'Rice + Roti (2) + Dal + Curry + Fry + Salad + Sweet', basePrice: 160, type: 'veg', category: 'thali',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 40, name: 'Chicken Deluxe Thali', subtitle: 'Rice + Roti (2) + Dal + Chicken (2) + Salad + Sweet', basePrice: 220, type: 'nonveg', category: 'thali',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // BEVERAGES (Page 15-16)
      {
        id: 41, name: 'Sweet Lassi', subtitle: 'Sweet yogurt drink', basePrice: 70, type: 'veg', category: 'beverages',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 42, name: 'Cold Coffee', subtitle: 'Chilled coffee drink', basePrice: 80, type: 'veg', category: 'beverages',
        image: 'https://images.unsplash.com/photo-1510707577719-ae7c9b788690?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 43, name: 'Cold Coffee with Boba', subtitle: 'Iced coffee with tapioca pearls', basePrice: 120, type: 'veg', category: 'beverages',
        image: 'https://images.unsplash.com/photo-1510707577719-ae7c9b788690?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // SWEETS (Page 16)
      {
        id: 44, name: 'Gajar Halwa', subtitle: 'Carrot pudding dessert', basePrice: 120, type: 'veg', category: 'sweets',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 45, name: 'Rice Kheer', subtitle: 'Rice pudding dessert', basePrice: 140, type: 'veg', category: 'sweets',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },

      // HEALTHY FOOD (Page 17)
      {
        id: 46, name: 'Piquants Salad', subtitle: 'Special garden salad', basePrice: 60, type: 'veg', category: 'healthy',
        image: 'https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      },
      {
        id: 47, name: 'Fruit Salad', subtitle: 'Fresh fruit medley', basePrice: 150, type: 'veg', category: 'healthy',
        image: 'https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        defaultAddons: [], extraAddons: []
      }
    ];
  }
}