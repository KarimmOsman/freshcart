import { OrdersService } from './../../core/services/orders/orders.service';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/services/auth/auth.service';
import { IOrder } from '../../core/models/iorder';
import {
  DecimalPipe,
  DatePipe,
  CommonModule,
  CurrencyPipe,
} from '@angular/common';

@Component({
  selector: 'app-allorders',
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.css'],
})
export class AllordersComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly ordersService = inject(OrdersService);
  private readonly destroyRef = inject(DestroyRef);
  userData!: { id: string };
  orders: WritableSignal<IOrder[]> = signal([]);

  ngOnInit(): void {
    this.getUserId();
    this.getUserOrdersData();
  }

  getUserId(): string | null {
    this.authService.sendUserData();
    if (this.authService.userData !== null) {
      this.userData = this.authService.userData as { id: string };
      return this.userData.id;
    }
    return null;
  }

  getUserOrdersData() {
    this.ordersService
      .getUserOrders(this.userData.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.orders.set(res);
        },
      });
  }
}
