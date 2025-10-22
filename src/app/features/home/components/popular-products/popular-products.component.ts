import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IProduct } from '../../../../core/models/iproduct';
import { ProductsService } from '../../../../core/services/products/products.service';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { SearchPipe } from '../../../../shared/pipes/search/search.pipe';

@Component({
  selector: 'app-popular-products',
  imports: [CardComponent, FormsModule, SearchPipe],
  templateUrl: './popular-products.component.html',
  styleUrls: ['./popular-products.component.css'],
})
export class PopularProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);
  products: WritableSignal<IProduct[]> = signal([]);
  searchValue: string = '';

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
        },
      });
  }
}
