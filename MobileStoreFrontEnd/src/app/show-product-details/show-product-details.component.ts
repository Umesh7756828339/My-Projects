import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../_model/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { ImageProcessingService } from '../image-processing.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit {

  showLoadMoreProductButton = false;
  pageNumer: number = 0;
  productDetails: Product[] = [];
  showTable = false;

  displayedColumns: string[] = ['Id', 'Product Name', 'Product Actual Price', 'Product Discounted Price', 'description', 'Actions'];

  constructor(
    private productService: ProductService,
    public imagesDialog: MatDialog,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  public getAllProducts(searchkeyword: string = "") {
    this.showTable = false;
    this.productService.getAllProducts(this.pageNumer, searchkeyword)
      .pipe(
        map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
      )
      .subscribe(
        (response: Product[]): void => {
          response.forEach(product => this.productDetails.push(product));
          this.showTable = true;
          this.showLoadMoreProductButton = response.length === 12;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }

  deleteProduct(productId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe(
          () => {
            this.getAllProducts();
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Oops....', 'Something went wrong', 'error');
          }
        );
      }
    });
  }

  showImages(product: Product) {
    this.imagesDialog.open(ShowProductImagesDialogComponent, {
      data: {
        images: product.productImages
      },
      height: '335px',
      width: '1000px'
    });
  }

  editProductDetails(productId: any) {
    this.router.navigate(['/addNewProduct', { productId: productId }]);
  }

  public loadMoreProduct() {
    this.pageNumer++;
    this.getAllProducts();
  }

  searchByKeyword(searchkeyword: string | undefined) {
    this.pageNumer = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }
}
