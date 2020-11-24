export interface IProductFull {
  id: string;
  productId: number;
  name: string;
  image: { sourceUrl: string };
  instrumentType: string;
  promoStatus: string;
  price: string;
  regularPrice: string;
  averageRating: number;
  description: string;
  reviews: any;
  reviewCount: number;
  stockQuantity: number;
  stockStatus: string;
  totalSales: number;
  productCategories: {
    nodes: [{
      name: string;
      description: string;
      productCategoryId: number;
    }]
  },
  testProp?: string;
}
