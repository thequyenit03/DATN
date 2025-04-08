import { Attribute } from "./attribute";
import { Review } from "./review";

export interface OrderDetail {
    id?: number;
    orderId?: number;
    productId: number;
    productName: string;
    productImage: string;
    productPrice: number;
    productDiscountPrice: number;
    qty: number;
    attribute?: string;

    reviews?: Review[];

    productAlias?: string;
    attributes: Attribute[];
    isReview?: boolean;
}
