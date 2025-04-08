import {Injectable} from '@angular/core';
import {OrderDetail} from '../model/order-detail';
import {Product} from '../model/product';
import {Constants} from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  getCart(): OrderDetail[] {
    let cartJson = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.CART);
    if (cartJson == null || cartJson == "")
      return [];
    return JSON.parse(cartJson);
  }

  addProductToCart(product: Product, qty: number = 1) {
    let cart: OrderDetail[] = [];
    let cartJson = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.CART);
    if (cartJson)
      cart = JSON.parse(cartJson);

    let pExist = cart.find(x => x.productId == product.id);
    if (pExist) {
      pExist.qty += qty;
    } else {
      cart.push({
        id: 0,
        productDiscountPrice: product.discountPrice,
        productId: product.id,
        productImage: product.image,
        productName: product.name,
        productAlias: product.alias,
        productPrice: product.price,
        qty: qty,
        attributes: product.attributes
      } as OrderDetail);
    }

    localStorage.setItem(Constants.LOCAL_STORAGE_KEY.CART, JSON.stringify(cart));
  }

  updateCart(cart: OrderDetail[]) {
    localStorage.setItem(Constants.LOCAL_STORAGE_KEY.CART, JSON.stringify(cart));
  }

  clearCart() {
    localStorage.removeItem(Constants.LOCAL_STORAGE_KEY.CART);
  }
}
