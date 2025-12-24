export interface Food {
  id: number;
  name: string;
  subtitle: string;
  basePrice: number;
  category: 'snacks' | 'starters' | 'sandwiches' | 'noodles' | 'pizzas' | 'pasta' | 'burgers' | 'gravy' | 'roti' | 'thali' | 'beverages' | 'sweets' | 'healthy' | 'bakery';
}

export interface Addon {
  id: number;
  name: string;
  price: number;
}