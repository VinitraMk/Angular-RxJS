import { Component, OnInit } from '@angular/core';

import { Observable, tap, of, Subscription, catchError, EMPTY, filter, map, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories$: Observable<ProductCategory[]> = this.categoryService.productCategories$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );
  selectedCategory = 1;
  selectedCategorySubject$ = new BehaviorSubject<number>(0);
  selectedCategoryAction$ = this.selectedCategorySubject$.asObservable();

  products$: Observable<Product[]> = this.productService.getProductsWithCategories()
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  productsSimpleFilter$ = combineLatest([this.productService.productsWithAdd$, this.selectedCategoryAction$])
  .pipe(
    map(([products, selectedCategoryId]) => products.filter(product =>
      selectedCategoryId === 0 ? true : product.categoryId === selectedCategoryId))
  )

  constructor(private productService: ProductService, private categoryService: ProductCategoryService) { }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.selectedCategorySubject$.next(+categoryId)
  }
}
