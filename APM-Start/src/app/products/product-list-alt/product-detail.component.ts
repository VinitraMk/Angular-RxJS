import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, combineLatest, combineLatestAll, EMPTY, filter, Observable } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';
import { map, tap, Subject } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private products$ : Observable<Product[]> = this.productService.getProductsWithCategories()
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err)
      return EMPTY
    })
  )

  product$:Observable<Product | undefined> = combineLatest([
    this.products$,
    this.productService.productSelectedAction$
  ]).pipe(
    map(([products, selectedProductId]) => products.find(product => product.id === selectedProductId))
  )

  productSupplier$ = this.productService.selectedProductSupplierJustInTime$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )

  pageTitle$ = this.product$
  .pipe(
    map(p => p ? `Product detail for: ${p.productName}` : null)
  );

  
  vm$ = combineLatest([
    this.product$,
    this.productSupplier$,
    this.pageTitle$
  ])
  .pipe(
    filter(([product]) => Boolean(product)),
    map(([product, productSuppliers, pageTitle]) =>
    ({product, productSuppliers, pageTitle}))
  )


  
  constructor(private productService: ProductService) { }

}
