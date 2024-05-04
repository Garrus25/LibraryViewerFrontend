import {Component, OnInit, Injectable} from '@angular/core';
import {DefaultService, BookDTO} from "../../openapi";
import {Router} from "@angular/router";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Observable, of} from "rxjs";

@Injectable()
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  books: BookDTO[] = [];
  bookCovers: Map<string, Blob> = new Map();

  constructor(private api: DefaultService, private router: Router, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  private fetchBooks(): void {
    this.api.getNewlyAddedBooks(5).subscribe({
      next: (books) => {
        this.books = books;
        console.log('Books fetched:', this.books);
        this.books.forEach(book => {
          this.fetchBooksCover(book.coverName, book.isbn);
        });
      },
      error: error => {
        console.error('Error during fetching books:', error);
      }
    });
  }

  private fetchBooksCover(coverName?: string, isbn?: string): void {
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
      const bookCover = this.bookCovers.get(isbn);
      if (bookCover) {
        const objectUrl = URL.createObjectURL(bookCover);
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

