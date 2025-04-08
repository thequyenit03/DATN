import {Attribute} from "./attribute";
import {ProductAttribute} from "./product-attribute";
import {ProductImage} from "./product-image";
import {ProductRelated} from "./product-related";
import {Review} from "./review";

export interface Product {
  id: number;
  menuId: number;
  name: string;
  alias: string;
  image: string;
  index: number;
  status: number;
  price: number;
  discountPrice: number;
  selling: boolean;
  shortDescription: string;
  description: string;
  providerCode: string;
  qty: number;
  isWishlist: boolean;

  productImages: ProductImage[];
  productRelateds: ProductRelated[];
  productAttributes: ProductAttribute[];
  reviews: Review[];

  menuName: string;
  providerName: string;
  attributes: Attribute[];

  totalQty: number;
  totalAmount: number;
  rateAvg: number;
}
