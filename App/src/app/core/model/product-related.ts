import { Product } from "./product";

export interface ProductRelated {
    id: number;
    productId: number;
    productRelatedId: number;

    product: Product
}
