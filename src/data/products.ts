
export interface Color {
  name: string;
  code: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  subcategory: string;
  images: string[];
  colors: Color[];
  material: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight: {
    value: number;
    unit: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  new: boolean;
  deliveryInfo: string;
  additionalInfo?: string[];
}

export const colors: Record<string, Color> = {
  olive: { name: 'Olive', code: '#595C3C' },
  cream: { name: 'Cream', code: '#F9F5EC' },
  beige: { name: 'Beige', code: '#E8DDCB' },
  terracotta: { name: 'Terracotta', code: '#D27D56' },
  navy: { name: 'Navy', code: '#2C3E50' },
  gray: { name: 'Gray', code: '#ADADAD' },
  charcoal: { name: 'Charcoal', code: '#373737' },
  brown: { name: 'Brown', code: '#8B572A' },
};

// Mock brands for the brand slider
export const brands = [
  {
    id: 'b1',
    name: 'Klekktik',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=Klekktik&font=playfair',
  },
  {
    id: 'b2',
    name: 'Villa Designers',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=Villa+Designers&font=script',
  },
  {
    id: 'b3',
    name: 'Castlery',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=CASTLERY&font=bebas',
  },
  {
    id: 'b4',
    name: 'Jonathan Adler',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=JONATHAN+ADLER&font=montserrat',
  },
  {
    id: 'b5',
    name: 'Inside Weather',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=Inside+Weather&font=raleway',
  },
  {
    id: 'b6',
    name: 'BDI',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=BDI&font=impact',
  },
  {
    id: 'b7',
    name: 'Outer',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=outer&font=helvetica',
  },
  {
    id: 'b8',
    name: 'Saatva',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=saatva&font=georgia',
  },
  {
    id: 'b9',
    name: 'Thuma',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=THUMA&font=arial',
  },
  {
    id: 'b10',
    name: 'Urban Nest',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=urban+nest&font=verdana',
  },
  {
    id: 'b11',
    name: 'Nogratz',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=NOGRATZ&font=courier',
  },
  {
    id: 'b12',
    name: 'Albany Park',
    logo: 'https://placehold.co/200x80/F9F5EC/595C3C?text=ALBANY+PARK&font=times',
  },
];

// Mock product suggestion data for the "For You" page
export const forYouSuggestions = [
  {
    id: 'fy1',
    title: 'Based on your browsing history',
    products: ['001', '003', '006', '005'],
  },
  {
    id: 'fy2',
    title: 'You might also like',
    products: ['002', '004', '005'],
  },
  {
    id: 'fy3',
    title: 'New arrivals in your favorite styles',
    products: ['006', '002'],
  },
];