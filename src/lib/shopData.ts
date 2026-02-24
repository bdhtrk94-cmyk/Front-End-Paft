export interface Product {
    id: number;
    name: string;
    nameAr?: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    category: string;
    categoryAr?: string;
    image: string;
    badge?: string;
    inStock: boolean;
    description: string;
    descriptionAr?: string;
    fullDescription?: string;
    fullDescriptionAr?: string;
}

export const categories = [
    { en: 'All', ar: 'الكل' },
    { en: 'Plastic Pallets', ar: 'باليتات بلاستيك' },
    { en: 'IBC Containers', ar: 'حاويات IBC' },
    { en: 'Crates & Bins', ar: 'صناديق وحاويات' },
    { en: 'Pallet Accessories', ar: 'إكسسوارات الباليتات' },
    { en: 'Custom Solutions', ar: 'حلول مخصصة' },
];

export const priceRanges = [
    { en: 'All Prices', ar: 'جميع الأسعار', min: 0, max: Infinity },
    { en: 'Under $50', ar: 'أقل من $50', min: 0, max: 50 },
    { en: '$50 – $150', ar: '$50 – $150', min: 50, max: 150 },
    { en: '$150 – $500', ar: '$150 – $500', min: 150, max: 500 },
    { en: '$500+', ar: '+$500', min: 500, max: Infinity },
];

export const sortOptions = [
    { en: 'Featured', ar: 'مميز', value: 'featured' },
    { en: 'Price: Low → High', ar: 'السعر: من الأقل', value: 'price-asc' },
    { en: 'Price: High → Low', ar: 'السعر: من الأعلى', value: 'price-desc' },
    { en: 'Top Rated', ar: 'الأعلى تقييماً', value: 'rating' },
    { en: 'Newest', ar: 'الأحدث', value: 'newest' },
];

export const PRODUCTS_PER_PAGE = 8;
