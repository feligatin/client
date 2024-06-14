import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de importar HttpClientModule
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component'; // Asegúrate de que la ruta sea correcta

interface Product {
  id: string;
  name: string;
  logo: string;
  description: string;
  date_release: string;
  date_revision: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, ConfirmationModalComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  searchTerm: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  productToDelete: Product | null = null;

  Math = Math;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      response => {
        if (Array.isArray(response.data)) {
          this.products = response.data;
          this.filteredProducts = response.data;
          this.updatePagination();
        } else {
          console.error('Expected an array but got:', response);
        }
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  searchProducts(): void {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  editProduct(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  confirmDeleteProduct(product: Product): void {
    this.productToDelete = product;
  }

  cancelDelete(): void {
    this.productToDelete = null;
  }

  deleteProduct(): void {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe(() => {
        this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
        this.filteredProducts = this.filteredProducts.filter(p => p.id !== this.productToDelete!.id);
        this.updatePagination();
        this.productToDelete = null;
      });
    }
  }
  openAddProductScreen(): void {
    this.router.navigate(['/add-product']); 
  }
}
