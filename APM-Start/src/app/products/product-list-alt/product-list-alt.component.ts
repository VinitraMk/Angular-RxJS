import { Component, OnInit, OnDestroy } from '@angular/core';

import { combineLatest, Observable, Subscription, map, Subject, catchError, EMPTY } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  products$: Observable<Product[]> = this.productService.productsWithCategories$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  selectedProduct$ = combineLatest([this.products$, this.productService.productSelectedAction$])
  .pipe(
    map(([products, selectedProductId]) => products.find(product => product.id === selectedProductId))
  )

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.setProductSelection(productId);
  }
}
