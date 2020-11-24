export interface IProduct {
  id?: string;
  productId: number;
  name: string;
  description?: string;
  image: { sourceUrl: string };
  instrumentType?: string;
  promoStatus?: string;
  price: string;
  regularPrice?: string;
  inWishlist?: boolean;
}
