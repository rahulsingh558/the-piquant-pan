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

interface Category {
  id: string;
  name: string;
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
  selectedCategory: string = 'all';

  categories: Category[] = [
    { id: 'all', name: 'All Items' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'starters', name: 'Starters' },
    { id: 'sandwiches', name: 'Sandwiches' },
    { id: 'noodles', name: 'Noodles & Maggi' },
    { id: 'pizzas', name: 'Pizzas' },
    { id: 'pasta', name: 'Pasta' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'gravy', name: 'Gravy Items' },
    { id: 'roti', name: 'Roti & Rice' },
    { id: 'thali', name: 'Thali' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'sweets', name: 'Sweets & Bakery' },
    { id: 'healthy', name: 'Healthy Food' }
  ];

  foods: MenuFood[] = [];

  /* =========================
     MODAL STATE
  ========================== */
  showAddonModal = false;
  selectedFood!: MenuFood;
  modalSelectedFreeAddons: Addon[] = [];
  modalSelectedPremiumAddons: Addon[] = [];
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
    'Bell Pepper': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=200&h=200&fit=crop&crop=center',
    'Extra Chicken': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200&h=200&fit=crop&crop=center',
    'Extra Paneer': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&crop=center',
    'Extra Sauce': 'https://images.unsplash.com/photo-1576797690066-3b4c7f59a4a2?w=200&h=200&fit=crop&crop=center'
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
        { id: 16, name: 'Extra Cheese', price: 30 },
        { id: 17, name: 'Extra Sauce', price: 20 },
      ];
    } else if (item.type === 'nonveg') {
      premiumAddons = [
        { id: 11, name: 'Capsicum', price: 20 },
        { id: 12, name: 'Broccoli', price: 25 },
        { id: 13, name: 'Cheese', price: 30 },
        { id: 14, name: 'Mushroom', price: 25 },
        { id: 16, name: 'Bell Pepper', price: 15 },
        { id: 18, name: 'Extra Chicken', price: 50 },
        { id: 19, name: 'Extra Sauce', price: 20 },
      ];
    }

    const allAddons = [...freeAddons, ...premiumAddons];

    return {
      id: item.id,
      name: item.name,
      subtitle: item.subtitle || 'Delicious • Fresh • Flavorful',
      basePrice: item.basePrice,
      category: 'snacks',
      type: item.type,
      image: item.image,
      addons: allAddons,
      freeAddonIds: freeAddons.map(a => a.id),
    };
  }

  /* =========================
     FALLBACK MENU - Based on PDF
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
      { id: 16, name: 'Extra Cheese', price: 30 },
      { id: 17, name: 'Extra Sauce', price: 20 },
    ];

    // Non-Veg premium addons
    const nonvegPremiumAddons: Addon[] = [
      { id: 11, name: 'Capsicum', price: 20 },
      { id: 12, name: 'Broccoli', price: 25 },
      { id: 13, name: 'Cheese', price: 30 },
      { id: 14, name: 'Mushroom', price: 25 },
      { id: 16, name: 'Bell Pepper', price: 15 },
      { id: 18, name: 'Extra Chicken', price: 50 },
      { id: 19, name: 'Extra Sauce', price: 20 },
    ];

    return [
      // SNACKS
      {
        id: 1,
        name: 'Veg Pakoda',
        subtitle: 'Crispy fried vegetable fritters',
        basePrice: 50,
        category: 'snacks',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 2,
        name: 'Potato Cheese Balls',
        subtitle: 'Crispy potato balls stuffed with cheese',
        basePrice: 99,
        category: 'snacks',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 3,
        name: 'Nachos with Cheese',
        subtitle: 'Crispy nachos topped with melted cheese',
        basePrice: 250,
        category: 'snacks',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },

      // STARTERS
      {
        id: 4,
        name: 'Paneer Tikka',
        subtitle: 'Grilled cottage cheese cubes with spices',
        basePrice: 180,
        category: 'starters',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 5,
        name: 'Chicken 65',
        subtitle: 'Spicy deep-fried chicken bites',
        basePrice: 175,
        category: 'starters',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },
      {
        id: 6,
        name: 'Egg Bhurji',
        subtitle: 'Spicy scrambled eggs with onions',
        basePrice: 80,
        category: 'starters',
        type: 'egg',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },

      // SANDWICHES
      {
        id: 7,
        name: 'Grilled Paneer Cheese',
        subtitle: 'Sourdough bread with paneer and cheese',
        basePrice: 150,
        category: 'sandwiches',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 8,
        name: 'Grilled Chicken Cheese',
        subtitle: 'Sourdough bread with chicken and cheese',
        basePrice: 160,
        category: 'sandwiches',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },

      // NOODLES
      {
        id: 9,
        name: 'Chicken Noodles',
        subtitle: 'Stir-fried noodles with chicken and vegetables',
        basePrice: 160,
        category: 'noodles',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },
      {
        id: 10,
        name: 'Piquant Special Maggi',
        subtitle: 'Veggies, Paneer, Mushroom, Corn, Cheese Maggi',
        basePrice: 120,
        category: 'noodles',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },

      // PIZZAS
      {
        id: 11,
        name: 'Cheese Pizza (7")',
        subtitle: 'Classic cheese pizza',
        basePrice: 150,
        category: 'pizzas',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 12,
        name: 'Chicken Cheese Pizza (7")',
        subtitle: 'Pizza topped with chicken and cheese',
        basePrice: 180,
        category: 'pizzas',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },

      // PASTA
      {
        id: 13,
        name: 'Cheese Pasta (White Sauce)',
        subtitle: 'Creamy white sauce pasta with cheese',
        basePrice: 160,
        category: 'pasta',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 14,
        name: 'Chicken Cheese Pasta (Pink Sauce)',
        subtitle: 'Pink sauce pasta with chicken and cheese',
        basePrice: 210,
        category: 'pasta',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },

      // BURGERS
      {
        id: 15,
        name: 'Chicken Burger',
        subtitle: 'Juicy chicken patty with veggies',
        basePrice: 145,
        category: 'burgers',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },

      // GRAVY ITEMS
      {
        id: 16,
        name: 'Paneer Butter Masala',
        subtitle: 'Cottage cheese in rich buttery gravy',
        basePrice: 170,
        category: 'gravy',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 17,
        name: 'Chicken Butter Masala',
        subtitle: 'Chicken in rich buttery gravy',
        basePrice: 180,
        category: 'gravy',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },

      // RICE ITEMS
      {
        id: 18,
        name: 'Chicken Biryani + Raita',
        subtitle: 'Fragrant rice with chicken and spices',
        basePrice: 199,
        category: 'roti',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },
      {
        id: 19,
        name: 'Veg Fried Rice',
        subtitle: 'Fried rice with mixed vegetables',
        basePrice: 150,
        category: 'roti',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },

      // THALI
      {
        id: 20,
        name: 'Veg Deluxe Thali',
        subtitle: 'Rice + Roti (2) + Dal + Curry + Fry + Salad + Sweet',
        basePrice: 160,
        category: 'thali',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 21,
        name: 'Chicken Deluxe Thali',
        subtitle: 'Rice + Roti (2) + Dal + Chicken (2) + Salad + Sweet',
        basePrice: 220,
        category: 'thali',
        type: 'nonveg',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...nonvegPremiumAddons],
      },

      // BEVERAGES
      {
        id: 22,
        name: 'Cold Coffee with Boba',
        subtitle: 'Iced coffee with tapioca pearls',
        basePrice: 120,
        category: 'beverages',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1510707577719-ae7c9b788690?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },
      {
        id: 23,
        name: 'Sweet Lassi',
        subtitle: 'Refreshing sweet yogurt drink',
        basePrice: 70,
        category: 'beverages',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },

      // SWEETS
      {
        id: 24,
        name: 'Gajar Halwa',
        subtitle: 'Traditional carrot pudding',
        basePrice: 120,
        category: 'sweets',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      },

      // HEALTHY FOOD
      {
        id: 25,
        name: 'Piquants Salad',
        subtitle: 'Fresh garden salad with special dressing',
        basePrice: 60,
        category: 'healthy',
        type: 'veg',
        image: 'https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?w=600&h=400&fit=crop&crop=center',
        freeAddonIds: [1, 2, 3, 4, 5],
        addons: [...freeAddons, ...vegEggPremiumAddons],
      }
    ];
  }

  /* =========================
     FILTER METHODS
  ========================== */
  get filteredFoods() {
    let filtered = this.foods;
    
    // Filter by type
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(f => f.type === this.selectedType);
    }
    
    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === this.selectedCategory);
    }
    
    return filtered;
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'All Items';
  }

  getTypeIcon(type: FoodType): string {
    switch(type) {
      case 'veg': return '🥬';
      case 'egg': return '🥚';
      case 'nonveg': return '🍗';
      default: return '🍽️';
    }
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