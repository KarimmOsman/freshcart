import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ICategory } from '../../../../core/models/icategory';
import { CategoriesService } from '../../../../core/services/categories/categories.service';

@Component({
  selector: 'app-popular-categories',
  imports: [CarouselModule],
  templateUrl: './popular-categories.component.html',
  styleUrls: ['./popular-categories.component.css'],
})
export class PopularCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly destroyRef = inject(DestroyRef);
  categories: WritableSignal<ICategory[]> = signal([]);

  ngOnInit(): void {
    this.getCategoriesData();
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-arrow-left fa-xl"></i>',
      '<i class="fa-solid fa-arrow-right fa-xl"></i>',
    ],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 5 },
    },
    nav: true,
  };
  getCategoriesData(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.categories.set(res.data);
        },
      });
  }
}
