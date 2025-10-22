import {
  Component,
  OnInit,
  WritableSignal,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../core/models/iproduct';
import { CardComponent } from '../../shared/components/card/card.component';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CardComponent, SearchPipe, FormsModule, NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  products: WritableSignal<IProduct[]> = signal([]);
  searchValue = '';
  pageSize!: number;
  p!: number;
  total!: number;

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(pageNumber: number = 1): void {
    this.productsService
      .getAllProducts(pageNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          this.pageSize = res.metadata.limit;
          this.p = res.metadata.currentPage;
          this.total = res.results;
        },
      });
  }
}
