import { Menu } from "./menu";

export interface Article {
    id: number;
    menuId: number;
    title: string;
    alias: string;
    image: string;
    index: number;
    shortDescription: string;
    description: string;
    active: boolean;
    created: Date;

    menu: Menu
}
