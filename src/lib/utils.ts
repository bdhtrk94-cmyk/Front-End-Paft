// Utility functions for the PAFT system

export function formatPrice(price: string): string {
  // Remove $ and convert to number, then format back
  const numPrice = parseFloat(price.replace('$', ''));
  return `$${numPrice.toFixed(2)}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `PAFT-${timestamp}-${randomStr}`.toUpperCase();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function calculateTotal(items: Array<{ price: string, quantity: number }>): string {
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);
  return `$${total.toFixed(2)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

interface ProductItem {
  id: number;
  name: string;
  description: string;
  category: string;
  [key: string]: unknown;
}

export function getProductById(products: ProductItem[], id: number) {
  return products.find(product => product.id === id);
}

export function filterProductsByCategory(products: ProductItem[], category: string) {
  if (category === 'all') return products;
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
}

export function searchProducts(products: ProductItem[], query: string) {
  const searchTerm = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
}