import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: "Standard Pallet 1200x800",
    nameAr: "منصة نقل قياسية 1200x800",
    price: 45,
    rating: 4.5,
    reviewCount: 12,
    category: "Standard",
    categoryAr: "قياسي",
    image: "/images/pallet-standard.jpg",
    inStock: true,
    stockQuantity: 50,
    description: "Heavy-duty plastic pallet suitable for warehouse storage and general logistics operations",
    descriptionAr: "منصة نقل بلاستيكية متينة مناسبة لتخزين المستودعات وعمليات اللوجستيات العامة",
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    name: "Euro Pallet 1200x1000",
    nameAr: "منصة نقل أوروبية 1200x1000",
    price: 52,
    rating: 4.7,
    reviewCount: 8,
    category: "Euro",
    categoryAr: "أوروبي",
    image: "/images/pallet-euro.jpg",
    inStock: true,
    stockQuantity: 30,
    description: "European standard plastic pallet for international shipping and export operations",
    descriptionAr: "منصة نقل بلاستيكية بالمعايير الأوروبية للشحن الدولي وعمليات التصدير",
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 3,
    name: "Heavy Duty Pallet 1200x1200",
    nameAr: "منصة نقل للأحمال الثقيلة 1200x1200",
    price: 68,
    rating: 4.8,
    reviewCount: 15,
    category: "Heavy Duty",
    categoryAr: "للأحمال الثقيلة",
    image: "/images/pallet-heavy.jpg",
    inStock: true,
    stockQuantity: 25,
    description: "Extra strong pallet designed for heavy industrial applications and extreme conditions",
    descriptionAr: "منصة نقل قوية جداً مصممة للتطبيقات الصناعية الثقيلة والظروف القاسية",
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  }
];

export const companyInfo = {
  name: "PAFT Plastic Pallets",
  nameAr: "شركة بافت للمنصات البلاستيكية",
  founded: 2010,
  employees: "50+",
  certifications: ["ISO 9001", "ISO 14001", "HACCP"],
  businessHours: "Sunday - Thursday, 9:00 AM - 6:00 PM (Egypt timezone)",
  contact: {
    email: "info@paft.eg",
    phone: "+20 123 456 7890",
    address: "Industrial Zone, Cairo, Egypt"
  }
};