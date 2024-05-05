import { Component } from '@angular/core';
import {BookDTO, DefaultService} from "../../openapi";
import {Observable, of} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-all-books',
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.css']
})
export class AllBooksComponent {
  books: BookDTO[] = [];
  bookCovers: Map<string, Blob> = new Map();

  constructor(private api: DefaultService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.api.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.books.forEach(book => {
          this.fetchBookCover(book.coverName, book.isbn);
        });
      },
      error: error => {
        console.error('Error during fetching all books:', error);
      }
    });
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
}
