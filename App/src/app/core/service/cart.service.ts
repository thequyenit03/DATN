import {Injectable} from '@angular/core';
import {OrderDetail} from '../model/order-detail';
import {Product} from '../model/product';
import {Constants} from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = Constants.LOCAL_STORAGE_KEY.CART;
  private readonly CART_TEMP_KEY = `${Constants.LOCAL_STORAGE_KEY.CART}_TEMP`;
 getCart(): OrderDetail[] {
    const json = localStorage.getItem(this.CART_KEY);
    if (!json) return [];
    try {
      return JSON.parse(json) as OrderDetail[];
    } catch (e) {
      console.warn('CartService.getCart(): parse error', e);
      return [];
    }
  }

    addProductToCart(product: Product, qty: number = 1): void {
    const cart = this.getCart();
    const exist = cart.find(x => x.productId === product.id);
    if (exist) {
      exist.qty += qty;
    } else {
      cart.push({
        id: 0,
        productId: product.id,
        productName: product.name,
        productAlias: product.alias,
        productImage: product.image,
        productPrice: product.price,
        productDiscountPrice: product.discountPrice,
        qty,
        attributes: product.attributes || []
      } as OrderDetail);
    }
    this.updateCart(cart);
  }

   updateCart(cart: OrderDetail[]): void {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('CartService.updateCart(): write error', e);
    }
  }

    clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }
   backupCart(): void {
    const cart = this.getCart();
    try {
      localStorage.setItem(this.CART_TEMP_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('CartService.backupCart(): write temp error', e);
    }
  }
  restoreCartFromBackup(): OrderDetail[] {
    const json = localStorage.getItem(this.CART_TEMP_KEY);
    if (!json) {
      // không có backup, trả về giỏ hàng chính
      return this.getCart();
    }
    let backup: OrderDetail[];
    try {
      backup = JSON.parse(json) as OrderDetail[];
    } catch (e) {
      console.warn('CartService.restoreCartFromBackup(): parse error', e);
      return this.getCart();
    }

    // Ghi backup thành giỏ hàng chính
    this.updateCart(backup);
    // Xoá bản temp
    localStorage.removeItem(this.CART_TEMP_KEY);
    return backup;
  }

}
