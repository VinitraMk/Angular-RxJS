import { Component } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage = '';
  product: Product | null = null;
  productSuppliers: Supplier[] | null = null;
  products$ : Observable<Product[]> = this.productService.products$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    })
  )

  constructor(private productService: ProductService) { }

}
