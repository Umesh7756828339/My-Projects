import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../image-processing.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pageNumber: number = 0;
  showLoadButton = false;
  productDetails: Product[] = [];

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  public getAllProducts(searchKey: string = ""): void {
    this.productService.getAllProducts(this.pageNumber, searchKey).subscribe(
      (response: Product[]) => {
        console.log(response);
        this.showLoadButton = response.length === 12;
        this.productDetails.push(...response.map(product => this.imageProcessingService.createImages(product)));
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  showProductDetails(productId: any): void {
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }

  loadMoreProduct(): void {
    this.pageNumber++;
    this.getAllProducts();
  }

  searchByKeyword(searchkeyword: any): void {
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }

  addToCart(productId: any): void {
    this.productService.addToCart(productId).subscribe(
      () => {
        Swal.fire({ icon: 'success', title: 'Product added to cart' });
        this.router.navigate(['/allproducts']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
