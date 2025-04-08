import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-master-layout',
  imports: [ShareModule],
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.css']
})
export class MasterLayoutComponent implements OnInit {
  isCollapsed: boolean = false;

  constructor(
    public ngZone: NgZone,
    public router: Router
  ) {
  }

  ngOnInit() {
  }

  logout() {
    this.navigate("/admin/dang-xuat")
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}
