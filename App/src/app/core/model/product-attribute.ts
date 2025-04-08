import { Attribute } from "./attribute";

export interface ProductAttribute {
    id: number;
    productId: number;
    attributeId: number;
    value: string;

    attribute: Attribute;
    checked: boolean;
}
