import { Component } from '@angular/core';
import {BookDTO, DefaultService} from "../../openapi";
import {Observable, of} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {MatSliderChange} from "@angular/material/slider";

@Component({
  selector: 'app-all-books',
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.css']
})
export class AllBooksComponent {
  books: BookDTO[] = [];
  bookCovers: Map<string, Blob> = new Map();
  filteredBooks: BookDTO[] = [];
  searchTerm: string = '';
  alphabeticalOrder: boolean = false;
  ratingFilter: number = 1;
  ratingFilterEnabled: boolean = false;
  originalBooksOrder: BookDTO[] = [];

  constructor(private api: DefaultService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.api.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.originalBooksOrder = [...books]; // dodane
        this.books.forEach(book => {
          this.fetchBookCover(book.coverName, book.isbn);
        });
        this.searchBooks();
      },
      error: error => {
        console.error('Error during fetching all books:', error);
      }
    });
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  private fetchBookCover(coverName?: string, isbn?: string): void {
    if (coverName && isbn) {
      this.api.getBookCover(coverName).subscribe({
        next: (cover) => {
          this.bookCovers.set(isbn, cover);
        },
        error: error => {
          console.error('Error during fetching cover:', error);
        }
      });
    } else {
      console.error('Cover name or book id is undefined');
    }
  }

  getCoverUrl(isbn: string | undefined): Observable<SafeUrl | undefined> {
    if (isbn) {
      const cover = this.bookCovers.get(isbn);
      if (cover) {
        const objectUrl = URL.createObjectURL(cover);
        return of(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
      }
    }
    return of(undefined);
  }

  navigateToBookDetails(isbn: string | undefined): void {
    if (isbn) {
      this.router.navigate(['/book-details', isbn]).then(r => console.log('Navigation result:', r));
    }
  }

  updateRatingFilter(event: MatSliderChange): void {
    this.ratingFilter = event.value;
    this.searchBooks();
  }

  searchBooks(): void {
    console.log('searchBooks called');
    console.log('ratingFilterEnabled:', this.ratingFilterEnabled);

    let filteredBooks = this.books;

    if (this.searchTerm) {
      filteredBooks = filteredBooks.filter(book => book.title ? book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : false);
    }

    if (this.alphabeticalOrder) {
      filteredBooks = filteredBooks.sort((a, b) => {
        if (a.title && b.title) {
          const titleA = a.title.toLowerCase().replace(/\s/g, '');
          const titleB = b.title.toLowerCase().replace(/\s/g, '');
          return titleA.localeCompare(titleB, 'pl');
        } else {
          return 0;
        }
      });
    } else {
      filteredBooks = [...this.originalBooksOrder]; // Przywrócenie oryginalnej kolejności
    }

    if (this.ratingFilterEnabled) {
      filteredBooks = filteredBooks
        .filter(book => book.averageRating ? book.averageRating >= this.ratingFilter : false)
        .sort((a, b) => {
          if (typeof a.averageRating === 'number' && typeof b.averageRating === 'number') {
            return b.averageRating - a.averageRating;
          } else {
            return 0;
          }
        });
    }

    this.filteredBooks = filteredBooks;
  }
}
