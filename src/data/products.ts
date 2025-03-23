
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

export const products: Product[] = [
  {
    id: '001',
    name: 'Circle Dining Chair',
    brand: 'Overgaard & Dyrman',
    price: 599,
    description: 'Redefine the way you relax with this timeless dining chair featuring a sculptural circular backrest and plush upholstery. Perfect for both formal dining settings and casual everyday use, this chair combines modernist aesthetics with unparalleled comfort.',
    category: 'furniture',
    subcategory: 'chairs',
    images: [
      'https://images.unsplash.com/photo-1561677978-583a8c7a4b43?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1974&auto=format&fit=crop',
    ],
    colors: [colors.gray, colors.charcoal, colors.beige, colors.terracotta],
    material: 'Solid oak wood, premium fabric upholstery',
    dimensions: {
      width: 60,
      height: 80,
      depth: 55,
      unit: 'cm',
    },
    weight: {
      value: 8,
      unit: 'kg',
    },
    ratings: {
      average: 4.8,
      count: 125,
    },
    stock: 45,
    featured: true,
    bestSeller: true,
    new: false,
    deliveryInfo: 'Full Free Delivery Service',
    additionalInfo: [
      'Handcrafted in Denmark',
      'Assembly required',
      'Available with customizable fabrics on request',
    ],
  },
  {
    id: '002',
    name: 'Deconstructed Rattan Bed',
    brand: 'Klekktik',
    price: 1299,
    description: 'A stunning centerpiece for any bedroom, this deconstructed rattan bed combines natural materials with a minimalist frame. The handwoven rattan headboard adds texture and warmth, while the solid wood base ensures durability and support.',
    category: 'furniture',
    subcategory: 'beds',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?q=80&w=2070&auto=format&fit=crop',
    ],
    colors: [colors.brown, colors.beige],
    material: 'Natural rattan, solid wood frame',
    dimensions: {
      width: 160,
      height: 90,
      depth: 200,
      unit: 'cm',
    },
    weight: {
      value: 35,
      unit: 'kg',
    },
    ratings: {
      average: 4.9,
      count: 87,
    },
    stock: 12,
    featured: true,
    bestSeller: false,
    new: true,
    deliveryInfo: 'Full Free Delivery Service',
    additionalInfo: [
      'Available in Queen and King sizes',
      'Professional assembly included',
      'Mattress sold separately',
    ],
  },
  {
    id: '003',
    name: 'Parker Walnut Desk',
    brand: 'Castlery',
    price: 849,
    description: 'Elevate your home office with the Parker Walnut Desk. Featuring a sleek silhouette, this desk combines a rich walnut veneer with solid wood legs for a sophisticated yet functional workspace. The spacious drawer provides discreet storage for office essentials.',
    category: 'furniture',
    subcategory: 'desks',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=2036&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526040652367-ac003a0475fe?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544438424-291c98657115?q=80&w=2069&auto=format&fit=crop',
    ],
    colors: [colors.brown],
    material: 'Walnut veneer, solid wood legs',
    dimensions: {
      width: 120,
      height: 75,
      depth: 60,
      unit: 'cm',
    },
    weight: {
      value: 25,
      unit: 'kg',
    },
    ratings: {
      average: 4.7,
      count: 103,
    },
    stock: 28,
    featured: true,
    bestSeller: true,
    new: false,
    deliveryInfo: 'Full Free Delivery Service',
    additionalInfo: [
      'One year warranty',
      'Simple assembly required',
      'Cable management system included',
    ],
  },
  {
    id: '004',
    name: 'Azul Terracotta Sheets',
    brand: 'Inside Weather',
    price: 129,
    description: 'Transform your bedroom with our luxurious Azul Terracotta sheet set. Made from 100% organic cotton with a 300 thread count, these sheets provide the perfect balance of softness and durability. The rich terracotta color pairs beautifully with neutrals or complementary blues.',
    category: 'bedding & bath',
    subcategory: 'sheets',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=2067&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584100366846-8b8bb2a69ff5?q=80&w=2067&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584100366811-9e472f7bfe9d?q=80&w=2067&auto=format&fit=crop',
    ],
    colors: [colors.terracotta, colors.beige, colors.navy],
    material: '100% Organic Cotton',
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
      unit: 'cm',
    },
    weight: {
      value: 1.2,
      unit: 'kg',
    },
    ratings: {
      average: 4.9,
      count: 245,
    },
    stock: 95,
    featured: true,
    bestSeller: false,
    new: false,
    deliveryInfo: 'Full Free Delivery Service',
    additionalInfo: [
      'OEKO-TEX certified',
      'Becomes softer with each wash',
      'Set includes 1 fitted sheet, 1 flat sheet, and 2 pillowcases',
    ],
  },
  {
    id: '005',
    name: 'Circle Sofa',
    brand: 'Serta',
    price: 1799,
    description: 'Beautifully crafted with a curved silhouette, the Circle Sofa brings elegant contemporary design to your living space. The plush cushions provide exceptional comfort, while the sturdy frame ensures longevity. Available in multiple upholstery options to match any décor.',
    category: 'furniture',
    subcategory: 'sofas',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop',
    ],
    colors: [colors.beige, colors.gray, colors.navy, colors.olive],
    material: 'Kiln-dried hardwood frame, high-density foam, premium fabric',
    dimensions: {
      width: 220,
      height: 85,
      depth: 95,
      unit: 'cm',
    },
    weight: {
      value: 55,
      unit: 'kg',
    },
    ratings: {
      average: 4.7,
      count: 189,
    },
    stock: 15,
    featured: false,
    bestSeller: true,
    new: false,
    deliveryInfo: 'Full Free Delivery Service',
    additionalInfo: [
      'Lifetime warranty on frame',
      'Removable and washable covers',
      'No assembly required',
    ],
  },
  {
    id: '006',
    name: 'Curved Accent Chair',
    brand: 'Jonathan Adler',
    price: 899,
    description: 'Make a statement with this sculptural accent chair featuring an organically curved form and sumptuous upholstery. Perfect as a focal point in any room, this chair combines artistic design with functional comfort. The unique shape provides both visual interest and ergonomic support.',
    category: 'furniture',
    subcategory: 'chairs',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop',
    ],
    colors: [colors.olive, colors.terracotta, colors.beige, colors.charcoal],
    material: 'Curved plywood shell, premium upholstery',
    dimensions: {
      width: 75,
      height: 80,
      depth: 70,
      unit: 'cm',
    },
    weight: {
      value: 15,
      unit: 'kg',
    },
    ratings: {
      average: 4.5,
      count: 112,
    },
    stock: 23,
    featured: false,
    bestSeller: false,
    new: true,
    deliveryInfo: 'Full Free Delivery Service',
    additionalInfo: [
      'Handcrafted in small batches',
      'Available in custom fabrics (lead time applies)',
      'No assembly required',
    ],
  },
];

// Mock categories for filters
export const categories = [
  {
    name: 'Category',
    options: [
      { id: 'furniture', name: 'Furniture', count: 45 },
      { id: 'bedding-bath', name: 'Bedding & Bath', count: 22 },
      { id: 'decor', name: 'Decor & Pillows', count: 31 },
      { id: 'lighting', name: 'Lighting', count: 18 },
      { id: 'rugs', name: 'Rugs', count: 24 },
      { id: 'outdoor', name: 'Outdoor', count: 19 },
    ],
  },
  {
    name: 'Price',
    options: [
      { id: 'under-500', name: 'Under $500', count: 35 },
      { id: '500-1000', name: '$500 - $1000', count: 42 },
      { id: '1000-2000', name: '$1000 - $2000', count: 28 },
      { id: 'over-2000', name: 'Over $2000', count: 15 },
    ],
  },
  {
    name: 'Brand',
    options: [
      { id: 'serta', name: 'Serta', count: 12 },
      { id: 'castlery', name: 'Castlery', count: 18 },
      { id: 'klekktik', name: 'Klekktik', count: 9 },
      { id: 'jonathan-adler', name: 'Jonathan Adler', count: 7 },
      { id: 'inside-weather', name: 'Inside Weather', count: 15 },
      { id: 'overgaard-dyrman', name: 'Overgaard & Dyrman', count: 5 },
    ],
  },
  {
    name: 'Color',
    options: [
      { id: 'beige', name: 'Beige', count: 25 },
      { id: 'gray', name: 'Gray', count: 30 },
      { id: 'blue', name: 'Blue', count: 18 },
      { id: 'green', name: 'Green', count: 15 },
      { id: 'brown', name: 'Brown', count: 22 },
      { id: 'terracotta', name: 'Terracotta', count: 10 },
    ],
  },
];

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

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Helper function to get similar products
export const getSimilarProducts = (product: Product, limit: number = 4): Product[] => {
  return products
    .filter(p => 
      p.id !== product.id && 
      (p.category === product.category || p.subcategory === product.subcategory)
    )
    .slice(0, limit);
};
