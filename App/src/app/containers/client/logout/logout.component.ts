import {Component, OnInit} from '@angular/core';
import { CartService } from '../../../core/service/cart.service';
import { Constants } from '../../../core/util/constants';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private cartService: CartService,    
  ) {}
  ngOnInit() {
     // 1. Backup giỏ hàng tạm thời
    this.cartService.backupCart();    
    localStorage.removeItem(Constants.LOCAL_STORAGE_KEY.TOKEN);
    localStorage.removeItem(Constants.LOCAL_STORAGE_KEY.SESSION);
    location.href = '/dang-nhap';
  }
}
