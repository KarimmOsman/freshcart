import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICategory } from '../../core/models/icategory';
import { BrandsService } from './services/brands.service';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
})
export class BrandsComponent implements OnInit {
  private readonly brandssService = inject(BrandsService);
  private readonly destroyRef = inject(DestroyRef);
  brands: WritableSignal<ICategory[]> = signal([]);

  ngOnInit(): void {
    this.getBrandsData();
  }

  getBrandsData(): void {
    this.brandssService
      .getAllBrands()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.brands.set(res.data);
        },
      });
  }
}
