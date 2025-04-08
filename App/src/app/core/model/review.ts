import { Product } from "./product";

export interface Review {
    id?: number;
    orderDetailId?: number;
    productId?: number;
    star: number;
    content: string;
    status: number;
    created?: Date;
    createdBy?: string;

    product?: Product;
}
