import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { BookDTO, DefaultService } from "../../openapi";

@Component({
  selector: 'app-all-books',
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.css']
})
export class AllBooksComponent {
  private books: BookDTO[] = [];
  private originalBooksOrder: BookDTO[] = [];
  private bookCovers: Map<string, Blob> = new Map();

  public filteredBooks: BookDTO[] = [];
  public searchTerm: string = '';
  public alphabeticalOrder: boolean = false;
  public ratingFilter: number = 1;
  public ratingFilterEnabled: boolean = false;

  constructor(private api: DefaultService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.fetchAllBooks();
  }


  navigateToBookDetails(isbn: string | undefined): void {
    if (isbn) {
      this.router.navigate(['/book-details', isbn]).then(r => console.log('Navigation result:', r));
    }
  }


  searchBooks(): void {
    let filteredBooks = this.books;

    if (this.searchTerm) {
      filteredBooks = this.filterBySearchTerm(filteredBooks);
    }

    if (this.alphabeticalOrder) {
      filteredBooks = this.sortAlphabetically(filteredBooks);
    } else {
      filteredBooks = [...this.originalBooksOrder];
    }

    if (this.ratingFilterEnabled) {
      filteredBooks = this.filterAndSortByRating(filteredBooks);
    }

    this.filteredBooks = filteredBooks;
  }

  private fetchAllBooks(): void {
    this.api.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.originalBooksOrder = [...books];
        this.fetchBookCovers(books);
        this.searchBooks();
      },
      error: error => {
        console.error('Error during fetching all books:', error);
      }
    });
  }

  private fetchBookCovers(books: BookDTO[]): void {
    books.forEach(book => {
      if (book.coverName && book.isbn) {
        this.api.getBookCover(book.coverName).subscribe({
          next: (cover) => {
            if (book.isbn)
            this.bookCovers.set(book.isbn, cover);
          },
          error: error => {
            console.error('Error during fetching cover:', error);
          }
        });
      } else {
        console.error('Cover name or book id is undefined');
      }
    });
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

  private filterBySearchTerm(books: BookDTO[]): BookDTO[] {
    return books.filter(book => book.title ? book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : false);
  }

  private sortAlphabetically(books: BookDTO[]): BookDTO[] {
    return books.sort((a, b) => {
      if (a.title && b.title) {
        const titleA = a.title.toLowerCase().replace(/\s/g, '');
        const titleB = b.title.toLowerCase().replace(/\s/g, '');
        return titleA.localeCompare(titleB, 'pl');
      } else {
        return 0;
      }
    });
  }

  private filterAndSortByRating(books: BookDTO[]): BookDTO[] {
    return books
      .filter(book => book.averageRating ? book.averageRating >= this.ratingFilter : false)
      .sort((a, b) => {
        if (typeof a.averageRating === 'number' && typeof b.averageRating === 'number') {
          return b.averageRating - a.averageRating;
        } else {
          return 0;
        }
      });
  }

  navigateToHomePage(): void {
    this.router.navigate(['/']).then(r => console.log('Navigation result:', r));
  }
}
