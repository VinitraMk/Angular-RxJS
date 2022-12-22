import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, Observable } from 'rxjs';
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
  pageTitle = 'Product Detail';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  product: Product | null = null;
  productSuppliers: Supplier[] | null = null;
  products$ : Observable<Product[]> = this.productService.getProductsWithCategories()
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
  
  constructor(private productService: ProductService) { }

}
