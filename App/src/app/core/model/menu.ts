import {Article} from "./article";
import {Product} from "./product";

export interface Menu {
  id: number;
  parentMenu: number;
  group: string;
  name: string;
  alias: string;
  index: number;
  showHomePage: boolean;
  type: string;
  active: boolean;
  parentMenuName: string;

  subMenus: Menu[];

  products: Product[],
  articles: Article[]
}
